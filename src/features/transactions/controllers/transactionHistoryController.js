'use strict'

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
          include: {
            tickets: {
              include: {
                whomPassangerTicket: true,
                whomFlightTicket: {
                  include: {
                    fromAirport: true,
                    toAirport: true,
                  }
                }
              }
            }
          }
        });
    
        const bookingView = bookings.map((transaction) => {
          const tickets = transaction.tickets.map((ticket) => {
            const flight = ticket.whomFlightTicket;
            const passanger = ticket.whomPassangerTicket;
            
            return {
              passanger_name: passanger.fullname,
              fromAirport: flight.fromAirport.name,
              toAirport: flight.toAirport.name,
              seat_number: passanger.seat_number,
              departure_time: flight.departure_time,
              arrival_time: flight.arrival_time,
              price: flight.ticket_price
            };
          });
    
          return {
            tickets,
            total_price: transaction.total_price,
            created_at: transaction.created_at,
            status: transaction.status ? 'paid' : 'unpaid'
          };
        });
    
        return res.json({
            status : true,
            message : 'success',
            data : {
                bookingView
            }
        })
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching bookings' });
      }
}

module.exports = {
    getTransactionHistoryController
}