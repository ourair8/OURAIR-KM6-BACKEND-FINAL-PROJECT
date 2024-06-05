'use strict'

const prisma = require('../../../config/prisma.config');
// const { sendNotification } = require('../../../libs/nodemailer.lib');
const { handleError } = require("../../../middleware/errorHandler");
const snap = require('../../../config/midtrans');
const { findAvailableFlights } = require('../services/passangerService');
const createPassengerController = async (req, res) => {
    try {
        const { passengers } = req.body;

        if (!Array.isArray(passengers) || passengers.length < 1 || passengers.length > 30) {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        const flights = await findAvailableFlights(passengers);
        if (!flights.length) {
            return res.status(404).json({ error: 'No available flights found.' });
        }

        let totalPrice = 0;
        passengers.forEach(passenger => {
            const flight = flights.find(f => f.id === passenger.ticket.flight_id);
            if (!flight) {
                throw new Error(`Flight with ID ${passenger.ticket.flight_id} not found`);
            }
            totalPrice += flight.ticket_price;
        });

        const createdTransaction = await prisma.transactions.create({
            data: {
                adult_price: totalPrice,
                baby_price: 0, 
                tax_price: totalPrice * 0.1, 
                total_price: totalPrice + (totalPrice * 0.1),
                created_at: new Date(),
                status: false
            }
        });

        const createdPassengers = await Promise.all(passengers.map(async passenger => {
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
                }
            });

            await prisma.tickets.create({
                data: {
                    user_id: req.user.id,
                    passanger_id: createdPassenger.id,
                    flight_id: passenger.ticket.flight_id,
                    transaction_id: createdTransaction.id,
                }
            });

            return createdPassenger;
        }));

        const orderDetails = {
            transaction_details: {
                order_id: "order-id-node-" + Math.round(new Date().getTime() / 1000),
                gross_amount: Number(createdTransaction.total_price)
            },
            credit_card: {
                secure: true
            },
            customer_details: {
                first_name: req.user.name,
                email: req.user.email,
                phone: req.user.phone_number
            }
        };

        const transaction = await snap.createTransaction(orderDetails);
        const transactionToken = transaction.token;

        await prisma.transactions.update({
            where: { id: createdTransaction.id },
            data: { midtrans_order_id: orderDetails.transaction_details.order_id }
        });

        // await sendNotification({
        //     to: req.user.email,
        //     subject: 'Booking Successful',
        //     text: `Your booking was successful. Please complete the payment using the following link: ${transaction.redirect_url}`,
        // });

        // await updateTransactionHistory({
        //     userId: req.user.id,
        //     transactionId: createdTransaction.id,
        //     status: 'Pending Payment',
        // });

        res.status(201).json({
            status: true,
            message: "success",
            data: {
                transaction: createdTransaction,
                passengers: createdPassengers,
                payment_link: transaction.redirect_url
            }
        });
    } catch (error) {
        console.error(error);
        handleError(error, res);
    }
};

module.exports = {
    createPassengerController
};