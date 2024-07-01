'use strict'

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: ['query'] });

const{ ErrorWithStatusCode, handleError } = require("../../middleware/errorHandler")


const getAirports = async function(req, res) {

    try {

    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;

    let filters = {};

    if (req.query.search) {
        filters = {
            OR: [
                {
                  code: {
                    contains: req.query.search,
                    mode: 'insensitive'
                  }
                },
                {
                  name: {
                    contains: req.query.search,
                    mode: 'insensitive'
                  },
                }
              ]
          }
    }

    
    

    const result = await prisma.airports.findMany({
        where : filters,
        skip: (page - 1) * limit,
        take: limit,
        distinct : ['code']
    })

    const totalairports = await prisma.airports.count({
        where: filters,
    });

    return res.json({
        status: true,
        message: 'success',
        totalItems: totalairports,
        totalPages: Math.ceil(totalairports / limit),
        currentPage: page,
        length: result.length,
        data: result,
        })

    } catch(err) {
        
        handleError(err, res)
    }

}
const getAirportByCityCode = async function(req, res) {
    const { cityCode } = req.query

    
    try {   
        const result = await prisma.airports.findMany({
            where : {
                cityCode : cityCode
            }
        })

        return res.status(200).json({
            status : true,
            message : 'success',
            data : {
                result
            }
        })
    } catch (err) {
        handleError(err, res)
    }
}

module.exports = {
    getAirportByCityCode, getAirports
}