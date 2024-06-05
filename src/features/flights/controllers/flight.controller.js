'use strict'

const prisma = require("../../../config/prisma.config")

const getFlightById = async function(req, res) {
    const id = parseInt(await req.body.id, 10);

    try {
        const user = await prisma.flights.findUnique({
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

        return res.json({
            status : true,
            message : 'success',
            data : user
        })
    } catch (err) {
        
        return res.status(500).json({
            status: false,
            message: 'Error searching flights'
        });
    }
}

const getFlightsByCityOrCountryName = async function(req, res){
    let city = String(req.query.city);
    city = city.charAt(0).toUpperCase() + city?.slice(1);

    let country = String(req.query.city);
    country = country.charAt(0).toUpperCase() + country?.slice(1);

    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;

    try {
        const flights = await prisma.flights.findMany({
            where: {
                OR: [
                    { fromAirport : { countryName : country }},
                    { toAirport : { countryName : country }},
                    { fromAirport: { cityName: city} },
                    { toAirport: { cityName: city} },
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
    let city = String(req.query.city);
    city = city.charAt(0).toUpperCase() + city.slice(1);

    let startDate = req.query.startDate ? new Date(req.query.startDate) : new Date();
    let endDate = req.query.endDate ? new Date(req.query.endDate) : new Date(new Date().setDate(new Date().getDate() + 30));

    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;

    try {
        const flights = await prisma.flights.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            { fromAirport: { cityName: city } },
                            { toAirport: { cityName: city } },
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
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        const totalFlights = await prisma.flights.count({
            where: {
                AND: [
                    {
                        OR: [
                            { fromAirport: { cityName: city } },
                            { toAirport: { cityName: city } },
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

module.exports = {
    getFlightById,
    getFlightsByCityOrCountryName,
    getFlightsByDate
}