'use strict'

// const WebSocket = require("ws");

const prisma = require('../../../config/prisma.config');
const snap = require('../../../config/midtrans');
const { findAvailableFlights } = require('../services/passangerService');
const {Seat, FlightSeats } = require('../../../db/schema')
const { handleError, ErrorWithStatusCode } = require("../../../middleware/errorHandler")


//websocket huzi

const { sendNotification } = require('../../../config/websocket');

const createPassengerController = async(req, res) => {
    try {
        const { passengers, baby, booker  } = await req.body;

        console.log(req.body)
        console.log('Passengers:', passengers);
        console.log('Baby:', baby);
        console.log('Booker:', booker);
        if (!Array.isArray(passengers) || passengers.length < 1 || passengers.length > 30 || baby.length < 1 || booker.length < 1) {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        if (typeof baby !== 'number' || baby < 0) {
            return res.status(400).json({ error: 'Invalid baby data' });
        }
    
        if (!booker || typeof booker !== 'object' || 
            !booker.fullname || !booker.surname || 
            !booker.phone_number || !booker.email) {
            return res.status(400).json({ error: 'Invalid booker data' });
        }
    

        const flight_id = passengers[0].ticket.flight_id;

        const flight = await prisma.flights.findUnique({
            where: {
                id: flight_id
            }
        });

        if (!flight) {
            throw new ErrorWithStatusCode(`Flight with ID ${flight_id} not found`, 404);
        }

        const flightMongo = await FlightSeats.findOne({ flightId: flight_id });

        if (!flightMongo || !Array.isArray(flightMongo.seats)) {
          throw new ErrorWithStatusCode(`Flight with ID ${flight_id} has no seats information`, 500);
        }
    
        let totalPrice = 0;

        for (const passenger of passengers) {
            const seat = flightMongo.seats.find(s => s.seatNumber === passenger.seat_number);
        
            if (!seat) {
              return res.status(200).json({ error: `Seat ${passenger.seat_number} does not exist` });
            }
        
            if (seat.isBooked) {
              return res.status(200).json({ error: `Seat ${passenger.seat_number} is already booked` });
            }

            totalPrice += flight.ticket_price;
        }

        
        const tax = totalPrice * 0.1;
        const totalWithTax = totalPrice + tax;

        const createdBooker = await prisma.bookers.create({
            data : {
                fullname : booker.fullname,
                surname : booker.surname,
                email : booker.email,
                phone_number : booker.phone_number
            }
        })

        const createdTransaction = await prisma.transactions.create({
            data: {
              adult_price: totalPrice,
              baby_price: 0, 
              tax_price: tax,
              total_price: totalWithTax,
              created_at: new Date(),
              status: false,
              booker_id : createdBooker.id,
              total_baby : baby,
              flight_id : flight_id
            }
        });

        let createdPassenger = []

        for (const passenger of passengers) {

            createdPassenger = await prisma.passengers.create({
                data: {
                    title : passenger.title,
                    fullname: passenger.fullname,
                    surname: passenger.surname,
                    birth_date: new Date(passenger.birth_date),
                    nationality: passenger.nationality,
                    category: passenger.category,
                    document: passenger.document,
                    country_publication: passenger.country_publication,
                    document_expired: new Date(passenger.document_expired),
                    seat_number: passenger.seat_number,
                }
            });

            const seat = flightMongo.seats.find(s => s.seatNumber === passenger.seat_number);
            seat.isBooked = true;
            seat.passengerId = createdPassenger.id

            await prisma.tickets.create({
                data: {
                    user_id: req.user.id,
                    passanger_id: createdPassenger.id,
                    flight_id: passenger.ticket.flight_id,
                    transaction_id: createdTransaction.id,
                }
            });
        }

        await flightMongo.save();

        const orderDetailsMidtrans = {
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

        const transactionMidtrans = await snap.createTransaction(orderDetailsMidtrans);

        const updatedTransactionMidtrans = await prisma.transactions.update({
            where: { id: createdTransaction.id },
            data: { midtrans_order_id: orderDetailsMidtrans.transaction_details.order_id }
        });

        await prisma.notifications.create({
            data: {
                user_id: req.user.id,
                title: 'Booking Successful',
                message: 'Your booking was successful. Please complete the payment',
                is_read: false,
                created_at: new Date()
            }
        });

        return res.status(201).json({
            status: true,
            message: "success",
            data: {
                transaction: updatedTransactionMidtrans,
                passengers: createdPassenger,
                payment_link: transactionMidtrans.redirect_url,
                booker : createdBooker
            }
        });


    //     const createdPassengers = await Promise.all(passengers.map(async passenger => {
    //         const flight = flights.find(f => f.id === passenger.ticket.flight_id);

    //         // const flightSeatsDoc = await FlightSeats.findOne({ flightId: flight.id });
    //         // if (!flightSeatsDoc) {
    //         //     throw new ErrorWithStatusCode('no flight available', 200)
    //         // }

    //         const seatIndex = flightSeatsDoc.seats.findIndex(seat => seat.seatNumber === passenger.seat_number);
    //         if (seatIndex === -1 || flightSeatsDoc.seats[seatIndex].isBooked) {
    //             throw new ErrorWithStatusCode(`Seat ${passenger.seat_number} is not available`, 200)
    //         }

    //         const createdPassenger = await prisma.passengers.create({
    //             data: {
    //                 fullname: passenger.fullname,
    //                 surname: passenger.surname,
    //                 birth_date: new Date(passenger.birth_date),
    //                 nationality: passenger.nationality,
    //                 category: passenger.category,
    //                 document: passenger.document,
    //                 country_publication: passenger.country_publication,
    //                 document_expired: new Date(passenger.document_expired),
    //                 seat_number: passenger.seat_number,
    //             }
    //         });

    //         flightSeatsDoc.seats[seatIndex].isBooked = true;
    //         flightSeatsDoc.seats[seatIndex].passengerId = createdPassenger.id;
    //         await flightSeatsDoc.save();

    //         await prisma.tickets.create({
    //             data: {
    //                 user_id: req.user.id,
    //                 passanger_id: createdPassenger.id,
    //                 flight_id: passenger.ticket.flight_id,
    //                 transaction_id: createdTransaction.id,
    //             }
    //         });

    //         return createdPassenger;
    //     }));

    //     const orderDetails = {
    //         transaction_details: {
    //             order_id: "order-id-node-" + Math.round(new Date().getTime() / 1000),
    //             gross_amount: Number(createdTransaction.total_price)
    //         },
    //         credit_card: {
    //             secure: true
    //         },
    //         customer_details: {
    //             first_name: req.user.name,
    //             email: req.user.email,
    //             phone: req.user.phone_number
    //         }
    //     };

    //     const transaction = await snap.createTransaction(orderDetails);

    //     const updatedTransaction = await prisma.transactions.update({
    //         where: { id: createdTransaction.id },
    //         data: { midtrans_order_id: orderDetails.transaction_details.order_id }
    //     });

    //     //logika payment yang ini, lebih baik di webhook atau di booking?
    //     // const createdPayment = await prisma.payments.create({
    //     //     data: {
    //     //         transaction_id: createdTransaction.id,
    //     //         payment_type: transaction.payment_type,
    //     //         payment_status: transaction.transaction_status,
    //     //         created_at: new Date()
    //     //     }
    //     // });


    //     //email
    //     // await sendNotification({
    //     //     to: req.user.email,
    //     //     subject: 'Booking Successful',
    //     //     text: `Your booking was successful. Please complete the payment using the following link: ${transaction.redirect_url}`,
    //     // });

    //     // await updateTransactionHistory({
    //     //     userId: req.user.id,
    //     //     transactionId: createdTransaction.id,
    //     //     status: 'Pending Payment',
    //     // });


    //     //web socket huzi
    //     sendNotification(req.user.id, {
    //         message: `Your booking was successful. Please complete the payment using the following link: ${transaction.redirect_url}`,
    //         transaction: updatedTransaction
    //     });

    //     //masukin notif huzi 
    //     await prisma.notifications.create({
    //         data: {
    //             user_id: req.user.id,
    //             title: 'Booking Successful',
    //             message: 'Your booking was successful. Please complete the payment',
    //             is_read: false,
    //             created_at: new Date()
    //         }
    //     });


    //     // //masukin notif samuel
    //     // const notification = await prisma.notifications.create({
    //     //     data: {
    //     //         user_id: req.user.id,
    //     //         title: "Transaction Created",
    //     //         message: `Your transaction with ID ${createdTransaction.id} has been created.`,
    //     //         is_read: false,
    //     //         created_at: new Date(),
    //     //     },
    //     // });

    // //     TypeError: Cannot read properties of undefined (reading 'clients')
    // // at createPassengerController (C:\Users\Owner\OneDrive\Pictures\Ourair\src\features\booking\controllers\passengerController.js:169:40)

    //     // console.log(req.app.locals.wss.clients)

    //     //web socket samuel

    //       // TypeError: Cannot read properties of undefined (reading 'clients')
    //             // at createPassengerController 
    //             // (C:\Users\Owner\OneDrive\Pictures\Ourair\src\features\booking\controllers\passengerController.js:168:40)
    //     // req.app.locals.wss.clients.forEach((client) => {
    //     //     if (client.readyState === WebSocket.OPEN && client.userId === req.user.id) {

              
    //     //         client.send(
    //     //             JSON.stringify({
    //     //                 type: "notification",
    //     //                 data: {
    //     //                     user_id: req.user.id,
    //     //                     title: "Transaction Created",
    //     //                     message: `Your transaction with ID ${createdTransaction.id} has been created.`,
    //     //                     is_read: false,
    //     //                     created_at: new Date(),
    //     //                 },
    //     //             })
    //     //         );
    //     //     }
    //     // });

    //     return res.status(201).json({
    //         status: true,
    //         message: "success",
    //         data: {
    //             transaction: updatedTransaction,
    //             passengers: createdPassengers,
    //             // payment: createdPayment,
    //             payment_link: transaction.redirect_url
    //         }
    //     });
    } catch (error) {
        console.error(error);
        handleError(error, res);
    }
};

module.exports = {
    createPassengerController
};