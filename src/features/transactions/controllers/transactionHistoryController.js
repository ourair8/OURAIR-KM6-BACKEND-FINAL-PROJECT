'use strict'

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getTransactionHistoryController = async function(req, res){
  const { id } = req.user;

  try {
    const bookings = await prisma.transactions.findMany({
        where: {
          tickets: {
            some: {
              user_id: id
            }
          }
        },
        select: {
          id: true,
          midtrans_order_id: true,
          adult_price: true,
          baby_price: true,
          tax_price: true,
          total_price: true,
          created_at: true,
          status: true,
          payment_link : true,
          booker_id: true,
          total_baby: true,
          flights : {
            select : {
              departure_time : true,
              arrival_time : true,
                fromAirport : {
                    select : {
                        name: true,
                        cityCode: true,
                        cityName: true,
                        countryCode: true,
                        countryName: true, 
                    }
                },
                toAirport : {
                    select : {
                        name: true,
                        cityCode: true,
                        cityName: true,
                        countryCode: true,
                        countryName: true,
                    }
                },
            }
          },
          bookers: {
            select: {
              id: true,
              fullname: true,
              surname: true,
              phone_number: true,
              email: true
            }
          },
          tickets: {
            select: {
              id: true,
              user_id: true,
              passanger_id: true,
              transaction_id: true,
              whomPassangerTicket: {
                select: {
                  id: true,
                  title: true,
                  fullname: true,
                  surname: true,
                  birth_date: true,
                  category: true,
                  nationality: true,
                  document: true,
                  country_publication: true,
                  document_expired: true,
                  seat_number: true
                }
              },
          }
        }
  }});
      
      
    console.log(bookings);

    // const bookingView = await Promise.all(bookings.map(async (transaction) => {
    //     const tickets = await Promise.all(transaction.tickets.map(async (ticket) => {
    //         const flight = ticket.whomFlightTicket;
    //         const passanger = ticket.whomPassangerTicket;
            
    //         return {
    //             passanger_name: passanger.fullname,
    //             fromAirport: flight?.fromAirport?.name || 'N/A',
    //             toAirport: flight?.toAirport?.name || 'N/A',
    //             seat_number: passanger.seat_number,
    //             departure_time: flight?.departure_time,
    //             arrival_time: flight?.arrival_time,
    //             price: flight?.ticket_price,
    //             booker : {
    //                 fullname : transaction.bookers.fullname,
    //                 surname : transaction.bookers.surname,
    //                 email : transaction.bookers.email,
    //                 phone_number : transaction.bookers.phone_number
    //             }
    //         };
    //     }));

    //     return {
    //         tickets,
    //         total_price: transaction.total_price,
    //         created_at: transaction.created_at,
    //         status: transaction.status ? 'paid' : 'unpaid'
    //     };
    // }));

    return res.status(201).json({
        status: true,
        message: 'success',
        data: {
            transaction : bookings }
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({
        status: false,
        message: 'Server error',
        error: error.message
    });
}
}

module.exports = {
    getTransactionHistoryController
}