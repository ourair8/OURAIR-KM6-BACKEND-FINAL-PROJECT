'use strict'

const prisma = require("../../../config/prisma.config")
const { handleError, ErrorWithStatusCode } = require("../../../middleware/errorHandler")

// const groupSeatsByRow = (seats) => {
//     return seats.reduce((acc, seat) => {
//       const row = seat.seatNumber[0]; 
//       if (!acc[row]) {
//         acc[row] = []; 
//       }
//       acc[row].push(seat);
//       return acc;
//     }, {});
//   };

const getFlightById = async function(req, res) {
    let id = req.query.id

    try {
        
        if(!id){
            throw new ErrorWithStatusCode('please provide id', 200)
        }

        id = Number(id)

        const flight = await prisma.flights.findUnique({
            where : {
                id : id
            },
            include : {
                whomAirplaneFlights : {
                    include: {
                        whomAirlinesAirplanes : true
                    }
                },
                fromAirport: true,
                toAirport:true,
            }
        })

        if(!flight){
            throw new ErrorWithStatusCode('no flight available', 200)
        }

        // const seat = await FlightSeats.findOne({ flightId: flight.id });
        const result = await FlightSeats.aggregate([
            { $match: { flightId: flight.id } },
            { $unwind: "$seats" },
            {
                $project: {
                    _id: 0,
                    seatNumber: "$seats.seatNumber",
                    isBooked: "$seats.isBooked",
                    seatInfo: {
                        seatNumber: "$seats.seatNumber",
                        isBooked: "$seats.isBooked"
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    seats: { $push: "$seatInfo" },
                    totalAvailableCount: { $sum: { $cond: [{ $eq: ["$isBooked", false] }, 1, 0] } }
                }
            },
            {
                $project: {
                    _id: 0,
                    seats: 1,
                    totalAvailableSeats: "$totalAvailableCount"
                }
            }
        ]);
        
        if (result.length > 0) {
            const flightInfo = {
                flightId: flight.id,
                flightNumber: flight.number,
                departureDate: flight.departure_time,
            };
        
            result[0].flightInfo = flightInfo;
        
            const groupedSeats = {};
            result[0].seats.forEach(seat => {
                const numberPart = seat.seatNumber.match(/^\d+/)[0]; 
                if (!groupedSeats[numberPart]) {
                    groupedSeats[numberPart] = [];
                }
                groupedSeats[numberPart].push(seat);
            });
        
            result[0].seats = Object.values(groupedSeats).map(group => group.sort((a, b) => {
                const numberA = parseInt(a.seatNumber.match(/\d+/)[0]);
                const numberB = parseInt(b.seatNumber.match(/\d+/)[0]);
                return numberA - numberB;
            }));
        }

                       
    
        // const availableSeats = seat.seats.filter(seat => seat.isBooked === false);

        if(!result){
            throw new ErrorWithStatusCode('no flight available', 200)
        }

        return res.json({
            status : true,
            message : 'success',
            data : flight, result
        })
    } catch (err) {
        console.log(err)
        handleError(err, res)
    }
}

const getFlightsByCityOrCountryName = async function(req, res){
    let city = String(req.query.city);
    city = city.charAt(0).toUpperCase() + city?.slice(1);

    let country = String(req.query.country);
    country = country.toUpperCase()

    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;

    try {
        const flights = await prisma.flights.findMany({
            where: {
                OR: [
                    { fromAirport: { countryName: country } },
                    { toAirport: { countryName: country } },
                    { fromAirport: { cityName: city } },
                    { toAirport: { cityName: city } },
                ],
                departure_time: {
                    gte: new Date(),
                },
            },
            select: {
                id: true,
                airplane_id: true,
                from_id: true,
                to_id: true,
                departure_time: true,
                arrival_time: true,
                flight_type: true,
                ticket_price: true,
                fromAirport: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        cityCode: true,
                        cityName: true,
                        countryCode: true,
                        countryName: true,
                        city: true,
                        total_visited: true,
                        thumbnail: true
                    }
                },
                toAirport: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        cityCode: true,
                        cityName: true,
                        countryCode: true,
                        countryName: true,
                        city: true,
                        total_visited: true,
                        thumbnail: true
                    }
                },
                whomAirplaneFlights: {
                    select: {
                        id: true,
                        airline_id: true,
                        airplane_code: true,
                        whomAirlinesAirplanes: {
                            select: {
                                id: true,
                                name: true,
                                airline_code: true
                            }
                        }
                    }
                }
            },
            skip: (page - 1) * limit,
            take: limit,
        });
        

        const totalFlights = await prisma.flights.count({
            where: {
                OR: [
                    { fromAirport: { cityName: city} },
                    { toAirport: { cityName: city} },
                ],
                departure_time: {
                    gte: new Date(),
                },
            },
        });

        return res.status(201).json({
            status: true,
            message: 'success',
            totalItems: totalFlights,
            totalPages: Math.ceil(totalFlights / limit),
            currentPage: page,
            length: flights.length,
            data: {
                flights,
            },
        });
    } catch (err) {
        
        return res.status(500).json({
            status: false,
            message: 'Error searching flights'
        });
    } 
}

//city=Jakarta&startDate=2023-05-01&endDate=2023-05-30

const getFlightsByDate = async function(req, res){


    try {

        let startDate = req.query.startDate ? new Date(req.query.startDate) : new Date();
        let endDate = req.query.endDate ? new Date(req.query.endDate) : new Date(new Date().setDate(new Date().getDate() + 30));
    
        let tocity = req.query.tocity
        let fromcity = req.query.fromcity
    
        let toairport = req.query.toairport    
        let fromairport = req.query.toairport
        
    
        let tocountry = req.query.tocountry
        let fromcountry = req.query.fromcountry
    
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 10;

        //ada kota dari dan tujuan
        if(tocity && fromcity) {

            tocity = String(tocity).charAt(0).toUpperCase() + tocity.slice(1);
            fromcity = String(fromcity).charAt(0).toUpperCase() + fromcity.slice(1);
            const class_type = req.query.class

            const flights = await prisma.flights.findMany({
                where: {
                    AND: [
                        { fromAirport: { cityName: fromcity } },
                        { toAirport: { cityName: tocity } },
                    ],

                    departure_time: {
                        gte: startDate,
                        lte: endDate,
                    },
                    ...(class_type && { class: class_type })
                },
                select: {
                    id: true,
                    airplane_id: true,
                    from_id: true,
                    to_id: true,
                    class : true,
                    departure_time: true,
                    arrival_time: true,
                    flight_type: true,
                    ticket_price: true,
                    fromAirport: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            cityCode: true,
                            cityName: true,
                            countryCode: true,
                            countryName: true,
                            city: true,
                            total_visited: true,
                            thumbnail: true
                        }
                    },
                    toAirport: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            cityCode: true,
                            cityName: true,
                            countryCode: true,
                            countryName: true,
                            city: true,
                            total_visited: true,
                            thumbnail: true
                        }
                    },
                    whomAirplaneFlights: {
                        select: {
                            id: true,
                            airline_id: true,
                            airplane_code: true,
                            whomAirlinesAirplanes: {
                                select: {
                                    id: true,
                                    name: true,
                                    airline_code: true
                                }
                            }
                        }
                    }
                },
                skip: (page - 1) * limit,
                take: limit,
            });
    
            const totalFlights = await prisma.flights.count({
                where: {
                    AND: [
                        {
                            AND: [
                                { fromAirport: { cityName: fromcity } },
                                { toAirport: { cityName: tocity } },

                            ],
                        },
                        {
                            departure_time: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    ],
                    ...(class_type && { class: class_type })
                },
            });
    
            return res.json({
                status: true,
                message: 'success',
                totalItems: totalFlights,
                totalPages: Math.ceil(totalFlights / limit),
                currentPage: page,
                length: flights.length,
                data: {
                    flights,
                },
            });
        }

        if(fromcity){
            fromcity = String(fromcity).charAt(0).toUpperCase() + fromcity.slice(1);
            const class_type = req.query.class

            const flights = await prisma.flights.findMany({
                where: {
                    fromAirport: { cityName: fromcity },
                    departure_time: {
                        gte: startDate,
                        lte: endDate,
                    },
                    ...(class_type && { class: class_type })
                },
                select: {
                    id: true,
                    airplane_id: true,
                    from_id: true,
                    to_id: true,
                    departure_time: true,
                    arrival_time: true,
                    class : true,
                    flight_type: true,
                    ticket_price: true,
                    fromAirport: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            cityCode: true,
                            cityName: true,
                            countryCode: true,
                            countryName: true,
                            city: true,
                            total_visited: true,
                            thumbnail: true
                        }
                    },
                    toAirport: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            cityCode: true,
                            cityName: true,
                            countryCode: true,
                            countryName: true,
                            city: true,
                            total_visited: true,
                            thumbnail: true
                        }
                    },
                    whomAirplaneFlights: {
                        select: {
                            id: true,
                            airline_id: true,
                            airplane_code: true,
                            whomAirlinesAirplanes: {
                                select: {
                                    id: true,
                                    name: true,
                                    airline_code: true
                                }
                            }
                        }
                    }
                },
                skip: (page - 1) * limit,
                take: limit,
            });
    
            const totalFlights = await prisma.flights.count({
                where: {
                    AND: [
                        {
                            fromAirport: { cityName: fromcity }
                        },
                        {
                            departure_time: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    ],
                    ...(class_type && { class: class_type })
                },
            });
    
            return res.json({
                status: true,
                message: 'success',
                totalItems: totalFlights,
                totalPages: Math.ceil(totalFlights / limit),
                currentPage: page,
                length: flights.length,
                data: {
                    flights,
                },
            });
        }

        if(tocity){
            tocity = String(tocity).charAt(0).toUpperCase() + tocity.slice(1);
            const class_type = req.query.class

            const flights = await prisma.flights.findMany({
                where: {
                    toAirport: { cityName: tocity },
                    departure_time: {
                        gte: startDate,
                        lte: endDate,
                    },
                    ...(class_type && { class: class_type })
                },
                select: {
                    id: true,
                    airplane_id: true,
                    from_id: true,
                    to_id: true,
                    departure_time: true,
                    arrival_time: true,
                    class : true,
                    flight_type: true,
                    ticket_price: true,
                    fromAirport: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            cityCode: true,
                            cityName: true,
                            countryCode: true,
                            countryName: true,
                            city: true,
                            total_visited: true,
                            thumbnail: true
                        }
                    },
                    toAirport: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            cityCode: true,
                            cityName: true,
                            countryCode: true,
                            countryName: true,
                            city: true,
                            total_visited: true,
                            thumbnail: true
                        }
                    },
                    whomAirplaneFlights: {
                        select: {
                            id: true,
                            airline_id: true,
                            airplane_code: true,
                            whomAirlinesAirplanes: {
                                select: {
                                    id: true,
                                    name: true,
                                    airline_code: true
                                }
                            }
                        }
                    }
                },
                skip: (page - 1) * limit,
                take: limit,
            });
    
            const totalFlights = await prisma.flights.count({
                where: {
                    AND: [
                        {
                            toAirport: { cityName: tocity }
                        },
                        {
                            departure_time: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    ],
                    ...(class_type && { class: class_type })
                },
            });
    
            return res.json({
                status: true,
                message: 'success',
                totalItems: totalFlights,
                totalPages: Math.ceil(totalFlights / limit),
                currentPage: page,
                length: flights.length,
                data: {
                    flights,
                },
            });
        }

        if(fromcountry && tocountry) {

            tocountry = String(tocountry).charAt(0).toUpperCase() + tocountry.slice(1);
            fromcountry = String(fromcountry).charAt(0).toUpperCase() + fromcountry.slice(1);
            const class_type = req.query.class

            const flights = await prisma.flights.findMany({
                where: {
                    AND: [
                        { fromAirport: { countryName: fromcountry } },
                        { toAirport: { countryName: tocountry } },
                    ],

                    departure_time: {
                        gte: startDate,
                        lte: endDate,
                    },
                    ...(class_type && { class: class_type })
                },
                select: {
                    id: true,
                    airplane_id: true,
                    from_id: true,
                    to_id: true,
                    class : true,
                    departure_time: true,
                    arrival_time: true,
                    flight_type: true,
                    ticket_price: true,
                    fromAirport: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            cityCode: true,
                            cityName: true,
                            countryCode: true,
                            countryName: true,
                            city: true,
                            total_visited: true,
                            thumbnail: true
                        }
                    },
                    toAirport: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            cityCode: true,
                            cityName: true,
                            countryCode: true,
                            countryName: true,
                            city: true,
                            total_visited: true,
                            thumbnail: true
                        }
                    },
                    whomAirplaneFlights: {
                        select: {
                            id: true,
                            airline_id: true,
                            airplane_code: true,
                            whomAirlinesAirplanes: {
                                select: {
                                    id: true,
                                    name: true,
                                    airline_code: true
                                }
                            }
                        }
                    }
                },
                skip: (page - 1) * limit,
                take: limit,
            });
    
            const totalFlights = await prisma.flights.count({
                where: {
                    AND: [
                        {
                            AND: [
                                { fromAirport: { countryName: fromcountry } },
                                { toAirport: { countryName: tocountry } },

                            ],
                        },
                        {
                            departure_time: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    ],
                    ...(class_type && { class: class_type })
                },
            });
    
            return res.json({
                status: true,
                message: 'success',
                totalItems: totalFlights,
                totalPages: Math.ceil(totalFlights / limit),
                currentPage: page,
                length: flights.length,
                data: {
                    flights,
                },
            });
        }

        if(fromcountry){
            fromcountry = String(fromcountry).toUpperCase()
            const class_type = req.query.class

            const flights = await prisma.flights.findMany({
                where: {
                    fromAirport: { countryName: fromcountry },
                    departure_time: {
                        gte: startDate,
                        lte: endDate,
                    },
                    ...(class_type && { class: class_type })
                },
                select: {
                    id: true,
                    airplane_id: true,
                    from_id: true,
                    to_id: true,
                    departure_time: true,
                    arrival_time: true,
                    class : true,
                    flight_type: true,
                    ticket_price: true,
                    fromAirport: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            cityCode: true,
                            cityName: true,
                            countryCode: true,
                            countryName: true,
                            city: true,
                            total_visited: true,
                            thumbnail: true
                        }
                    },
                    toAirport: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            cityCode: true,
                            cityName: true,
                            countryCode: true,
                            countryName: true,
                            city: true,
                            total_visited: true,
                            thumbnail: true
                        }
                    },
                    whomAirplaneFlights: {
                        select: {
                            id: true,
                            airline_id: true,
                            airplane_code: true,
                            whomAirlinesAirplanes: {
                                select: {
                                    id: true,
                                    name: true,
                                    airline_code: true
                                }
                            }
                        }
                    }
                },
                skip: (page - 1) * limit,
                take: limit,
            });
    
            const totalFlights = await prisma.flights.count({
                where: {
                    AND: [
                        {
                            fromAirport: { countryName: fromcountry }
                        },
                        {
                            departure_time: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    ],
                    ...(class_type && { class: class_type })
                },
            });
    
            return res.json({
                status: true,
                message: 'success',
                totalItems: totalFlights,
                totalPages: Math.ceil(totalFlights / limit),
                currentPage: page,
                length: flights.length,
                data: {
                    flights,
                },
            });
        }
        // i am here to country
        if(tocountry){
            tocountry = String(tocountry).toUpperCase()
            const class_type = req.query.class

            const flights = await prisma.flights.findMany({
                where: {
                    toAirport: { countryName: tocountry },
                    departure_time: {
                        gte: startDate,
                        lte: endDate,
                    },
                    ...(class_type && { class: class_type })
                },
                select: {
                    id: true,
                    airplane_id: true,
                    from_id: true,
                    to_id: true,
                    departure_time: true,
                    arrival_time: true,
                    class : true,
                    flight_type: true,
                    ticket_price: true,
                    fromAirport: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            cityCode: true,
                            cityName: true,
                            countryCode: true,
                            countryName: true,
                            city: true,
                            total_visited: true,
                            thumbnail: true
                        }
                    },
                    toAirport: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            cityCode: true,
                            cityName: true,
                            countryCode: true,
                            countryName: true,
                            city: true,
                            total_visited: true,
                            thumbnail: true
                        }
                    },
                    whomAirplaneFlights: {
                        select: {
                            id: true,
                            airline_id: true,
                            airplane_code: true,
                            whomAirlinesAirplanes: {
                                select: {
                                    id: true,
                                    name: true,
                                    airline_code: true
                                }
                            }
                        }
                    }
                },
                skip: (page - 1) * limit,
                take: limit,
            });
    
            const totalFlights = await prisma.flights.count({
                where: {
                    AND: [
                        {
                            toAirport: { countryName: tocountry }
                        },
                        {
                            departure_time: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    ],
                    ...(class_type && { class: class_type })
                },
            });
    
            return res.json({
                status: true,
                message: 'success',
                totalItems: totalFlights,
                totalPages: Math.ceil(totalFlights / limit),
                currentPage: page,
                length: flights.length,
                data: {
                    flights,
                },
            });
        }

        if(fromairport && toairport) {

            toairport = String(toairport)
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');


            fromairport = String(toairport)
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

            const class_type = req.query.class

            const flights = await prisma.flights.findMany({
                where: {
                    AND: [
                        { fromAirport: { name: fromairport } },
                        { toAirport: { name: toairport } },
                    ],

                    departure_time: {
                        gte: startDate,
                        lte: endDate,
                    },
                    ...(class_type && { class: class_type })
                },
                select: {
                    id: true,
                    airplane_id: true,
                    from_id: true,
                    to_id: true,
                    class : true,
                    departure_time: true,
                    arrival_time: true,
                    flight_type: true,
                    ticket_price: true,
                    fromAirport: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            cityCode: true,
                            cityName: true,
                            countryCode: true,
                            countryName: true,
                            city: true,
                            total_visited: true,
                            thumbnail: true
                        }
                    },
                    toAirport: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            cityCode: true,
                            cityName: true,
                            countryCode: true,
                            countryName: true,
                            city: true,
                            total_visited: true,
                            thumbnail: true
                        }
                    },
                    whomAirplaneFlights: {
                        select: {
                            id: true,
                            airline_id: true,
                            airplane_code: true,
                            whomAirlinesAirplanes: {
                                select: {
                                    id: true,
                                    name: true,
                                    airline_code: true
                                }
                            }
                        }
                    }
                },
                skip: (page - 1) * limit,
                take: limit,
            });
    
            const totalFlights = await prisma.flights.count({
                where: {
                    AND: [
                        {
                            AND: [
                                { fromAirport: { name: fromairport } },
                                { toAirport: { name: toairport } },

                            ],
                        },
                        {
                            departure_time: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    ],
                    ...(class_type && { class: class_type })
                },
            });
    
            return res.json({
                status: true,
                message: 'success',
                totalItems: totalFlights,
                totalPages: Math.ceil(totalFlights / limit),
                currentPage: page,
                length: flights.length,
                data: {
                    flights,
                },
            });
        }

        if(fromairport) {

            fromairport = String(fromairport)
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

            const class_type = req.query.class

            const flights = await prisma.flights.findMany({
                where: {
                    fromAirport: { name: fromairport },
                    departure_time: {
                        gte: startDate,
                        lte: endDate,
                    },
                    ...(class_type && { class: class_type })
                },
                select: {
                    id: true,
                    airplane_id: true,
                    from_id: true,
                    to_id: true,
                    class : true,
                    departure_time: true,
                    arrival_time: true,
                    flight_type: true,
                    ticket_price: true,
                    fromAirport: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            cityCode: true,
                            cityName: true,
                            countryCode: true,
                            countryName: true,
                            city: true,
                            total_visited: true,
                            thumbnail: true
                        }
                    },
                    toAirport: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            cityCode: true,
                            cityName: true,
                            countryCode: true,
                            countryName: true,
                            city: true,
                            total_visited: true,
                            thumbnail: true
                        }
                    },
                    whomAirplaneFlights: {
                        select: {
                            id: true,
                            airline_id: true,
                            airplane_code: true,
                            whomAirlinesAirplanes: {
                                select: {
                                    id: true,
                                    name: true,
                                    airline_code: true
                                }
                            }
                        }
                    }
                },
                skip: (page - 1) * limit,
                take: limit,
            });
    
            const totalFlights = await prisma.flights.count({
                where: {
                    AND: [
                        { fromAirport : { name: fromairport } },
                        {
                            departure_time: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    ],
                    ...(class_type && { class: class_type })
                },
            });
    
            return res.json({
                status: true,
                message: 'success',
                totalItems: totalFlights,
                totalPages: Math.ceil(totalFlights / limit),
                currentPage: page,
                length: flights.length,
                data: {
                    flights,
                },
            });
        }

        if(toairport) {

            toairport = String(toairport)
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

            const class_type = req.query.class

            const flights = await prisma.flights.findMany({
                where: {
                    toAirport: { name: toairport },
                    departure_time: {
                        gte: startDate,
                        lte: endDate,
                    },
                    ...(class_type && { class: class_type })
                },
                select: {
                    id: true,
                    airplane_id: true,
                    from_id: true,
                    to_id: true,
                    class : true,
                    departure_time: true,
                    arrival_time: true,
                    flight_type: true,
                    ticket_price: true,
                    fromAirport: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            cityCode: true,
                            cityName: true,
                            countryCode: true,
                            countryName: true,
                            city: true,
                            total_visited: true,
                            thumbnail: true
                        }
                    },
                    toAirport: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                            cityCode: true,
                            cityName: true,
                            countryCode: true,
                            countryName: true,
                            city: true,
                            total_visited: true,
                            thumbnail: true
                        }
                    },
                    whomAirplaneFlights: {
                        select: {
                            id: true,
                            airline_id: true,
                            airplane_code: true,
                            whomAirlinesAirplanes: {
                                select: {
                                    id: true,
                                    name: true,
                                    airline_code: true
                                }
                            }
                        }
                    }
                },
                skip: (page - 1) * limit,
                take: limit,
            });
    
            const totalFlights = await prisma.flights.count({
                where: {
                    AND: [
                        { toAirport : { name: toairport } },
                        {
                            departure_time: {
                                gte: startDate,
                                lte: endDate,
                            },
                        },
                    ],
                    ...(class_type && { class: class_type })
                },
            });
    
            return res.json({
                status: true,
                message: 'success',
                totalItems: totalFlights,
                totalPages: Math.ceil(totalFlights / limit),
                currentPage: page,
                length: flights.length,
                data: {
                    flights,
                },
            });
        }

        return res.json({
            status : true,
            message : 'success',
            data : []
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            status: false,
            message: 'Error searching flights'
        });
    }
};

const getFlightsByDateRevision = async function(req, res) {

    try {
        let startDate = req.query.startDate ? new Date(req.query.startDate) : new Date();
        let endDate = req.query.endDate && req.query.endDate.trim() !== "''" ? new Date(req.query.endDate) : null;        
    
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 10;

        let filters = {};

        if (req.query.fromcity) {
            filters = {
                ...filters,
                fromAirport: {
                    cityName: req.query.fromcity.charAt(0).toUpperCase() + req.query.fromcity.slice(1).toLowerCase()
                }
            };
        }
    
        if (req.query.tocity) {
            filters = {
                ...filters,
                toAirport: {
                    cityName: req.query.tocity.charAt(0).toUpperCase() + req.query.tocity.slice(1).toLowerCase()
                }
            };
        }
    
        if (req.query.fromairport) {
            let formattedFromAirportName = req.query.fromairport
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
    
            filters = {
                ...filters,
                fromAirport: {
                    name: formattedFromAirportName
                }
            };
        }

        let dateFilter = {
            departure_time: {
                gte: startDate,
            }
        };
        
        if (endDate && !isNaN(endDate.getTime())) {
            dateFilter.departure_time.lte = endDate;
        }
    
        if (req.query.toairport) {
            let formattedToAirportName = req.query.toairport
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
    
            filters = {
                ...filters,
                toAirport: {
                    name: formattedToAirportName
                }
            };
        }
    
        if (req.query.fromcountry) {
            let formattedFromCountryName = req.query.fromcountry.toUpperCase();
    
            filters = {
                ...filters,
                fromAirport: {
                    ...filters.fromAirport,
                    countryName: formattedFromCountryName
                }
            };
        }
    
        if (req.query.tocountry) {
            let formattedToCountryName = req.query.tocountry.toUpperCase();
    
            filters = {
                ...filters,
                toAirport: {
                    ...filters.toAirport,
                    countryName: formattedToCountryName
                }
            };
        }
    
        if (req.query.class) {
            filters = {
                ...filters,
                class: req.query.class.toUpperCase()
            };
        }
    
        const flights = await prisma.flights.findMany({
            where: {
                AND: [
                    dateFilter,
                    Object.keys(filters).length ? filters : {}
                ]
            },
            select: {
                id: true,
                airplane_id: true,
                from_id: true,
                to_id: true,
                class: true,
                departure_time: true,
                arrival_time: true,
                flight_type: true,
                ticket_price: true,
                fromAirport: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        cityCode: true,
                        cityName: true,
                        countryCode: true,
                        countryName: true,
                        city: true,
                        total_visited: true,
                        thumbnail: true
                    }
                },
                toAirport: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        cityCode: true,
                        cityName: true,
                        countryCode: true,
                        countryName: true,
                        city: true,
                        total_visited: true,
                        thumbnail: true
                    }
                },
                whomAirplaneFlights: {
                    select: {
                        id: true,
                        airline_id: true,
                        airplane_code: true,
                        baggage : true,
                        cabin_baggage:true,
                        whomAirlinesAirplanes: {
                            select: {
                                id: true,
                                name: true,
                                airline_code: true
                            }
                        }
                    }
                }
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        const flightIds = flights.map(flight => flight.id);
        const flightSeats = await FlightSeats.find({ flightId: { $in: flightIds } });

        const flightsWithSeats = flights.map(flight => {
            const seatsForFlight = flightSeats.find(seat => seat.flightId === flight.id);
            const availableSeats = seatsForFlight ? seatsForFlight.seats.filter(seat => !seat.isBooked).length : 0;
            return {
                ...flight,
                availableSeats
            };
        });
    
        const totalFlights = await prisma.flights.count({
            where: {
                AND: [
                    dateFilter,
                    Object.keys(filters).length ? filters : {}
                ]
            },
        });
    
        return res.json({
            status: true,
            message: 'success',
            totalItems: totalFlights,
            totalPages: Math.ceil(totalFlights / limit),
            currentPage: page,
            length: flights.length,
            data: {
                flights: flightsWithSeats,
            },
        });
    } catch (err) {
        console.error('Error fetching flights:', err);
        return res.status(500).json({
            status: false,
            message: 'Failed to fetch flights',
            error: err.message,
        });
    }
    
    
};

function capitalize(str) {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}


const getFlightsByDateToFrom = async function(req, res){
    // let city = String(req.query.city)
    // .split(' ')
    // .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    // .join(' ');

    let airport = String(req.query.airport)
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

    let startDate = req.query.startDate ? new Date(req.query.startDate) : new Date();
    let endDate = req.query.endDate ? new Date(req.query.endDate) : new Date(new Date().setDate(new Date().getDate() + 30));

    let toAirport = String(req.query.toairport)
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

    console.log(toAirport)

    let fromAirport = String(req.query.fromairport)
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

    console.log(fromAirport)

    let toCity = String(req.query.tocity)
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

    console.log(toCity)
    
    let fromCity = String(req.query.fromcity)
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

    console.log(fromCity)

    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;

    try {
        const flights = await prisma.flights.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            { fromAirport: { cityName: fromCity } },
                            { toAirport: { cityName: toCity } },
                            { fromAirport : { name : fromAirport }},
                            { toAirport : { name : toAirport }}
                        ],
                    },
                    {
                        departure_time: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                ],
            },
            include: {
                fromAirport: true,
                toAirport: true,
                whomAirplaneFlights:true
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        const totalFlights = await prisma.flights.count({
            where: {
                AND: [
                    {
                        OR: [
                            { fromAirport: { cityName: toCity } },
                            { toAirport: { cityName: fromCity } },
                            { fromAirport : { name : toAirport }},
                            { toAirport : { name : fromAirport }}
                        ],
                    },
                    {
                        departure_time: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                ],
            },
        });

        return res.json({
            status: true,
            message: 'success',
            totalItems: totalFlights,
            totalPages: Math.ceil(totalFlights / limit),
            currentPage: page,
            length: flights.length,
            data: {
                flights,
            },
        });
    } catch (err) {
        
        return res.status(500).json({
            status: false,
            message: 'Error searching flights'
        });
    }
};

// const getFlight

const getAllFlightsByCityOrCountryNameFrom = async function(req, res) {
    let city = req.query.city ? req.query.city.charAt(0).toUpperCase() + req.query.city.slice(1) : '';
    let country = req.query.country ? req.query.country.toUpperCase() : '';
    
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;

    if (!city && !country) {
        try {
            const flights = await prisma.flights.findMany({
                where: {
                    departure_time: {
                        gte: new Date()
                    }
                },
                include: {
                    fromAirport: true,
                    toAirport: true,
                    whomAirplaneFlights : true
                },
                orderBy: {
                    fromAirport: {
                        cityName: 'asc',
                    }
                },
                skip: (page - 1) * limit,
                take: limit,
            });

            const totalFlights = await prisma.flights.count({
                where: {
                    departure_time: {
                        gte: new Date(),
                    },
                },
            });

            return res.status(200).json({
                status: true,
                message: 'success',
                totalItems: totalFlights,
                totalPages: Math.ceil(totalFlights / limit),
                currentPage: page,
                length: flights.length,
                data: {
                    flights,
                },
            });

        } catch (err) {
            return res.status(500).json({
                status: false,
                message: 'Error retrieving flights',
                error: err.message,
            });
        }
    }

    try {
        const flights = await prisma.flights.findMany({
            where: {
                OR: [
                    { fromAirport: { countryName: country }},
                    { fromAirport: { cityName: city } },
                ],
                departure_time: {
                    gte: new Date(),
                },
            },
            include: {
                fromAirport: true,
                toAirport: true,
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        const totalFlights = await prisma.flights.count({
            where: {
                OR: [
                    { fromAirport: { cityName: city || undefined} },
                    { fromAirport: { countryName: country || undefined }},
                ],
                departure_time: {
                    gte: new Date(),
                },
            },
        });

        return res.status(200).json({
            status: true,
            message: 'success',
            totalItems: totalFlights,
            totalPages: Math.ceil(totalFlights / limit),
            currentPage: page,
            length: flights.length,
            data: {
                flights,
            },
        });
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: 'Error searching flights',
            error: err.message,
        });
    } 
}

const getAllFlightsByCityOrCountryNameTo = async function(req, res) {
    let city = req.query.city ? req.query.city.charAt(0).toUpperCase() + req.query.city.slice(1) : '';
    let country = req.query.country ? req.query.country.toUpperCase() : '';
    
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;

    if (!city && !country) {
        try {
            const flights = await prisma.flights.findMany({
                where: {
                    departure_time: {
                        gte: new Date()
                    }
                },
                include: {
                    fromAirport: true,
                    toAirport: true,
                    whomAirplaneFlights : true
                },
                orderBy: {
                    fromAirport: {
                        cityName: 'asc',
                    }
                },
                skip: (page - 1) * limit,
                take: limit,
            });

            const totalFlights = await prisma.flights.count({
                where: {
                    departure_time: {
                        gte: new Date(),
                    },
                },
            });

            return res.status(200).json({
                status: true,
                message: 'success',
                totalItems: totalFlights,
                totalPages: Math.ceil(totalFlights / limit),
                currentPage: page,
                length: flights.length,
                data: {
                    flights,
                },
            });

        } catch (err) {
            return res.status(500).json({
                status: false,
                message: 'Error retrieving flights',
                error: err.message,
            });
        }
    }

    try {
        const flights = await prisma.flights.findMany({
            where: {
                OR: [
                    { toAirport: { countryName: country }},
                    { toAirport: { cityName: city } },
                ],
                departure_time: {
                    gte: new Date(),
                },
            },
            include: {
                fromAirport: true,
                toAirport: true,
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        const totalFlights = await prisma.flights.count({
            where: {
                OR: [
                    { toAirport: { cityName: city || undefined} },
                    { toAirport: { countryName: country || undefined }},
                ],
                departure_time: {
                    gte: new Date(),
                },
            },
        });

        return res.status(200).json({
            status: true,
            message: 'success',
            totalItems: totalFlights,
            totalPages: Math.ceil(totalFlights / limit),
            currentPage: page,
            length: flights.length,
            data: {
                flights,
            },
        });
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: 'Error searching flights',
            error: err.message,
        });
    } 
}

const getFlightRecommendation = async function(req, res) {
    try {

        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 10;
    
        let country = String(req.query.tocountry).toUpperCase()
        let fcountry = String(req.query.fromcountry).toUpperCase()

        if(!req.query.tocountry && !req.query.fromcountry){
            console.log("disini")
            const flight = await prisma.flights.findMany({
                where : {
                    departure_time: {
                        gte: new Date(),
                    },
                },
                select : {
                    id : true,
                    departure_time : true,
                    class : true,
                    arrival_time : true,
                    ticket_price : true,
                    fromAirport : {
                        select : {
                            name : true,
                            cityName : true,
                            countryName : true,
                            rating : true,
                        }
                    },
                    toAirport : {
                        select : {
                            name : true,
                            cityName : true,
                            countryName : true,
                            rating : true,
                        }
                    },
                    whomAirplaneFlights : {
                        select : {
                            whomAirlinesAirplanes : {
                                select : {
                                    name : true
                                }
                            }
                        }
                    }
                },
                skip: (page - 1) * limit,
                take: limit,
            })
            return res.json({
                status : true,
                message : 'success',
                data : flight
            })
        }

        console.log("disini 2", fcountry)

        if(req.query.tocountry && req.query.fromcountry){

            const flight = await prisma.flights.findMany({
                where : {
                    AND: [
                        { fromAirport: { countryName : fcountry }},
                        { toAirport: { countryName: country } },
                    ],
                    departure_time: {
                        gte: new Date(),
                    },
                },
                select : {
                    id : true,
                    departure_time : true,
                    class : true,
                    arrival_time : true,
                    ticket_price : true,
                    fromAirport : {
                        select : {
                            name : true,
                            cityName : true,
                            countryName : true,
                            rating : true,
                        }
                    },
                    toAirport : {
                        select : {
                            name : true,
                            cityName : true,
                            countryName : true,
                            rating : true,
                        }
                    },
                    whomAirplaneFlights : {
                        select : {
                            whomAirlinesAirplanes : {
                                select : {
                                    name : true
                                }
                            }
                        }
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
            })

            return res.json({
                status : true,
                message : 'success',
                data : flight
            })
    }

    if(req.query.tocountry && !req.query.fromcountry) {
        
        const flight = await prisma.flights.findMany({
            where : {
                AND: [
                    { toAirport: { countryName: country } },
                ],
                departure_time: {
                    gte: new Date(),
                },
            },
            select : {
                id : true,
                departure_time : true,
                class : true,
                arrival_time : true,
                ticket_price : true,
                fromAirport : {
                    select : {
                        name : true,
                        cityName : true,
                        countryName : true,
                        rating : true,
                    }
                },
                toAirport : {
                    select : {
                        name : true,
                        cityName : true,
                        countryName : true,
                        rating : true,
                    }
                },
                whomAirplaneFlights : {
                    select : {
                        whomAirlinesAirplanes : {
                            select : {
                                name : true
                            }
                        }
                    }
                },
            },
            skip: (page - 1) * limit,
            take: limit,
        })

        return res.json({
            status : true,
            message : 'success',
            data : flight
        })
    }

    if(!req.query.tocountry && req.query.fromcountry) {
        
        const flight = await prisma.flights.findMany({
            where : {
                AND: [
                    { fromAirport: { countryName: fcountry } },
                ],
                departure_time: {
                    gte: new Date(),
                },
            },
            select : {
                id : true,
                departure_time : true,
                class : true,
                arrival_time : true,
                ticket_price : true,
                fromAirport : {
                    select : {
                        name : true,
                        cityName : true,
                        countryName : true,
                        rating : true,
                    }
                },
                toAirport : {
                    select : {
                        name : true,
                        cityName : true,
                        countryName : true,
                        rating : true,
                        thumbnail:true,
                    }
                },
                whomAirplaneFlights : {
                    select : {
                        whomAirlinesAirplanes : {
                            select : {
                                name : true
                            }
                        }
                    }
                },
            },
            skip: (page - 1) * limit,
            take: limit,
        })

        return res.json({
            status : true,
            message : 'success',
            data : flight
        })
    }

    } catch(err){
        return res.status(500).json({
            status: false,
            message: 'Error searching flights',
            error: err.message,
        });
    }
}

const getFlightRecommendationOptimized = async function(req, res) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const country = req.query.tocountry ? req.query.tocountry.toUpperCase() : null;
        const fcountry = req.query.fromcountry ? req.query.fromcountry.toUpperCase() : null;

        let whereClause = {
            departure_time: {
                gte: new Date(),
            },
        };

        if (fcountry && country) {
            whereClause.AND = [
                { fromAirport: { countryName: fcountry } },
                { toAirport: { countryName: country } },
            ];
        } else if (fcountry) {
            whereClause.fromAirport = { countryName: fcountry };
        } else if (country) {
            whereClause.toAirport = { countryName: country };
        }

        const flight = await prisma.flights.findMany({
            where: whereClause,
            select: {
                departure_time: true,
                class: true,
                arrival_time: true,
                ticket_price: true,
                fromAirport: {
                    select: {
                        name: true,
                        cityName: true,
                        countryName: true,
                        rating: true,
                    },
                },
                toAirport: {
                    select: {
                        name: true,
                        cityName: true,
                        countryName: true,
                        rating: true,
                    },
                },
                whomAirplaneFlights: {
                    select: {
                        whomAirlinesAirplanes: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        return res.json({
            status: true,
            message: 'success',
            data: flight,
        });
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: 'Error searching flights',
            error: err.message,
        });
    }
};


const {Seat, FlightSeats } = require('../../../db/schema')

const getAllSeatFlight = async function(req, res) {
    const flightid = Number(req.query.id)

    console.log(flightid)
    try {
        const seat = await FlightSeats.findOne({ flightId: flightid });

        if(!seat){
            throw new ErrorWithStatusCode('no flight available', 200)
        }


        return res.json({
            status : true,
            message : 'success',
            length : seat.seats.length,
            data : seat
        })

    } catch  (err) {
        console.log(err)
        handleError(err, res);
    }
}




module.exports = {
    getFlightById,
    getFlightsByCityOrCountryName,
    getFlightsByDate,
    getAllFlightsByCityOrCountryNameFrom,
    getAllFlightsByCityOrCountryNameTo,
    getFlightsByDateToFrom,
    getFlightRecommendation,
    getAllSeatFlight,
    getFlightsByDateRevision
}