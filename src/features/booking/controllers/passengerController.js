'use strict'

const prisma = require('../../../config/prisma.config');
const { sanitizeBody, handleValidationErrors } = require('../../../validators/bodyValidator');
const { verifyToken } = require('../../../features/auth/controllers/whoAmI');
const { sendNotification } = require('../../../libs/nodemailer.lib');
const { ErrorWithStatusCode, handleError } = require("../../../middleware/errorHandler");
const snap = require('../../../config/midtrans');
const { findAvailableFlights } = require('../services/passangerService');
const { createTransaction } = require('../../transactions/services/transactionsMidtrans');
const { createPassenger } = require('../../booking/services/passangerService');
const { updateTransactionHistory } = require('../../transactions/services/index');

const createPassengerController = async function(req, res) {
    try {

        sanitizeBody(req.body);
        handleValidationErrors(req);


        verifyToken(req, res, async() => {
            const { passengers } = req.body;

            if (!Array.isArray(passengers) || passengers.length < 1 || passengers.length > 30) {
                return res.status(400).json({ error: 'Invalid input data' });
            }


            const flights = await findAvailableFlights(passengers);
            if (!flights.length) {
                return res.status(404).json({ error: 'No available flights found.' });
            }


            let totalPrice = 0;
            for (const passenger of passengers) {
                const flight = flights.find(f => f.id === passenger.ticket.flight_id);
                if (!flight) {
                    return res.status(404).json({ error: `Flight with ID ${passenger.ticket.flight_id} not found` });
                }
                totalPrice += flight.ticket_price;
            }


            const createdTransaction = await createTransaction({
                userId: req.user.id,
                flights: flights,
                paid: false,
                adult_price: passengers.length * totalPrice,
                baby_price: 0,
                tax_price: Math.round(totalPrice * 0.1),
                total_price: totalPrice + Math.round(totalPrice * 0.1),
                status: false,
                created_at: new Date()
            });


            const createdPassengers = await Promise.all(passengers.map(async passenger => {
                const createdPassenger = await createPassenger({
                    fullname: passenger.fullname,
                    surname: passenger.surname,
                    birth_date: new Date(passenger.birth_date),
                    nationality: passenger.nationality,
                    document: passenger.document,
                    country_publication: passenger.country_publication,
                    document_expired: new Date(passenger.document_expired),
                    seat_number: passenger.seat_number,
                    transaction_id: createdTransaction.id
                });

                await prisma.tickets.create({
                    data: {
                        user_id: req.user.id,
                        passenger_id: createdPassenger.id,
                        flight_id: passenger.ticket.flight_id,
                        transaction_id: createdTransaction.id,
                    }
                });

                return createdPassenger;
            }));


            const orderDetails = {
                transaction_details: {
                    order_id: "order-id-node-" + Math.round((new Date()).getTime() / 1000),
                    gross_amount: createdTransaction.total_price
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


            await sendNotification({
                to: req.user.email,
                subject: 'Booking Successful',
                text: `Your booking was successful. Please complete the payment using the following link: ${transaction.redirect_url}`,
            });


            await updateTransactionHistory({
                userId: req.user.id,
                transactionId: createdTransaction.id,
                status: 'Pending Payment',
            });


            res.status(201).json({
                status: true,
                message: "success",
                data: {
                    transaction: createdTransaction,
                    passengers: createdPassengers,
                    payment_link: transaction.redirect_url
                }
            });
        });
    } catch (error) {
        console.error(error);
        handleError(error, res);
    }
}

module.exports = {
    createPassengerController
}