"use strict";

const prisma = require("../../../config/prisma.config");
const snap = require("../../../config/midtrans");
const { findAvailableFlights } = require("../services/passangerService");
const { Seat, FlightSeats } = require("../../../db/schema");
const {
  handleError,
  ErrorWithStatusCode,
} = require("../../../middleware/errorHandler");

const createPassengerController = async (req, res) => {
  try {
    let { passengers, baby, booker, donation } = req.body;

    

    if (
      !Array.isArray(passengers) ||
      passengers.length < 1 ||
      passengers.length > 30 ||
      baby.length < 1 ||
      booker.length < 1
    ) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    if (typeof baby !== "number" || baby < 0) {
      return res.status(400).json({ error: "Invalid baby data" });
    }

    let total_donation = 0

    

    if (!donation || typeof donation !== "number" || donation < 0) {
      donation = 0
    }

    total_donation = donation

    
    



    if (
      !booker ||
      typeof booker !== "object" ||
      !booker.fullname ||
      !booker.surname ||
      !booker.phone_number ||
      !booker.email
    ) {
      return res.status(400).json({ error: "Invalid booker data" });
    }

    const flight_id = passengers[0].ticket.flight_id;

    const flight = await prisma.flights.findUnique({
      where: { id: flight_id },
    });

    if (!flight) {
      throw new ErrorWithStatusCode(
        `Flight with ID ${flight_id} not found`,
        404
      );
    }

    const flightMongo = await FlightSeats.findOne({ flightId: flight_id });

    if (!flightMongo || !Array.isArray(flightMongo.seats)) {
      throw new ErrorWithStatusCode(
        `Flight with ID ${flight_id} has no seats information`,
        500
      );
    }

    let totalPrice = 0;

    for (const passenger of passengers) {
      const seat = flightMongo.seats.find(
        (s) => s.seatNumber === passenger.seat_number
      );

      if (!seat) {
        return res
          .status(200)
          .json({ error: `Seat ${passenger.seat_number} does not exist` });
      }

      if (seat.isBooked) {
        return res
          .status(200)
          .json({ error: `Seat ${passenger.seat_number} is already booked` });
      }

      totalPrice += flight.ticket_price;
    }

    const tax = totalPrice * 0.1;
    const totalWithTax = totalPrice + tax + total_donation;

    

    const createdBooker = await prisma.bookers.create({
      data: {
        fullname: booker.fullname,
        surname: booker.surname,
        email: booker.email,
        phone_number: booker.phone_number,
      },
    });

    const createdTransaction = await prisma.transactions.create({
      data: {
        adult_price: totalPrice,
        baby_price: 0,
        tax_price: tax,
        total_price: totalWithTax,
        created_at: new Date(),
        donation : total_donation,
        status: false,
        booker_id: createdBooker.id,
        total_baby: baby,
        flight_id: flight_id,
      },
    });

    let createdPassengers = [];

    for (const passenger of passengers) {
      const createdPassenger = await prisma.passengers.create({
        data: {
          title: passenger.title,
          fullname: passenger.fullname,
          surname: passenger.surname,
          birth_date: new Date(passenger.birth_date),
          nationality: passenger.nationality,
          category: passenger.category,
          document: passenger.document,
          country_publication: passenger.country_publication,
          document_expired: new Date(passenger.document_expired),
          seat_number: passenger.seat_number,
        },
      });

      createdPassengers.push(createdPassenger);

      const seat = flightMongo.seats.find(
        (s) => s.seatNumber === passenger.seat_number
      );
      seat.isBooked = true;
      seat.passengerId = createdPassenger.id;

      await prisma.tickets.create({
        data: {
          passanger_id: createdPassenger.id,
          flight_id: passenger.ticket.flight_id,
          transaction_id: createdTransaction.id,
        },
      });
    }

    await flightMongo.save();

    const orderDetailsMidtrans = {
      transaction_details: {
        order_id: "order-id-node-" + Math.round(new Date().getTime() / 1000),
        gross_amount: Number(createdTransaction.total_price),
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: req.user.name,
        email: req.user.email,
        phone: req.user.phone_number,
      },
    };

    const transactionMidtrans = await snap.createTransaction(
      orderDetailsMidtrans
    );

    const  token = req.token

    const updatedTransactionMidtrans = await prisma.transactions.update({
      where: { id: createdTransaction.id },
      data: {
        user_id : req.user.id,
        midtrans_order_id: orderDetailsMidtrans.transaction_details.order_id,
        payment_link: transactionMidtrans.redirect_url,
        transaction_token : token
      },
    });

    await prisma.notifications.create({
      data: {
        user_id: req.user.id,
        title: "Pemesanan Berhasil",
        message: `Pemesanan sukses, mohon melakukan pembayaran menggunakan link:`,
        link : transactionMidtrans.redirect_url,
        is_read: false,
        created_at: new Date(),
      },
    });

    
    const bookedSeats = flightMongo.seats.filter(seat => seat.isBooked).map(seat => seat.seatNumber);
    
    const io = req.app.get('io');
    
    io.emit(`post-booking-${token}`, { message : `Pemesanan sukses, mohon melakukan pembayaran menggunakan link`, link :  transactionMidtrans.redirect_url });
    io.emit(`seat-${flight_id}`, {
      bookedSeats,
    });

    return res.status(201).json({
      status: true,
      message: "success",
      data: {
        transaction: updatedTransactionMidtrans,
        passengers: createdPassengers,
        payment_link: transactionMidtrans.redirect_url,
        booker: createdBooker,
      },
    });
  } catch (error) {
    console.error(error);
    handleError(error, res);
  }
};

module.exports = {
  createPassengerController,
};

