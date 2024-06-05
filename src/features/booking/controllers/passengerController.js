"use strict";
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

const prisma = require("../../../config/prisma.config");

const { ErrorWithStatusCode, handleError } = require("../../../middleware/errorHandler");

const createPassangerController = async function (req, res) {
  const { passengers } = req.body;

  if (!Array.isArray(passengers) || passengers.length < 1 || passengers.length > 30) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    //ngitungg total price berdasarkan ticket price tiap flight yang dipilih
    let totalPrice = 0;
    for (const passenger of passengers) {
      const flight = await prisma.flights.findUnique({
        where: { id: passenger.ticket.flight_id },
      });

      if (!flight) {
        return res.status(404).json({ error: `Flight with ID ${passenger.ticket.flight_id} not found` });
      }

      totalPrice += flight.ticket_price;
    }

    const createdTransaction = await prisma.transactions.create({
      data: {
        adult_price: passengers.length * totalPrice,
        baby_price: 0,
        tax_price: Math.round(totalPrice * 0.1),
        total_price: totalPrice + Math.round(totalPrice * 0.1),
        status: false,
        created_at: new Date(),
      },
    });

    const createdPassengers = await Promise.all(
      passengers.map(async (passenger) => {
        const createdPassenger = await prisma.passengers.create({
          data: {
            fullname: passenger.fullname,
            surname: passenger.surname,
            birth_date: new Date(passenger.birth_date),
            nationality: passenger.nationality,
            document: passenger.document,
            country_publication: passenger.country_publication,
            document_expired: new Date(passenger.document_expired),
            seat_number: passenger.seat_number,
          },
        });

        await prisma.tickets.create({
          data: {
            user_id: req.user.id,
            passanger_id: createdPassenger.id,
            flight_id: passenger.ticket.flight_id,
            transaction_id: createdTransaction.id,
          },
        });

        return createdPassenger;
      })
    );

    res.status(201).json({
      status: true,
      message: "success",
      data: {
        transaction: createdTransaction,
        passengers: createdPassengers,
      },
    });

    // Create notification for the created transaction
    const notification = await prisma.notifications.create({
      data: {
        user_id: req.user.id,
        title: "Transaction Created",
        message: `Your transaction with ID ${createdTransaction.id} has been created.`,
        is_read: false,
        created_at: new Date(),
      },
    });

    // Emit notification to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client.userId === req.user.id) {
        client.send(
          JSON.stringify({
            type: "notification",
            data: notification,
          })
        );
      }
    });
  } catch (error) {
    console.error(error);
    handleError(err, res);
  }
};

module.exports = {
  createPassangerController,
};
