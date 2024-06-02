'use strict'

const prisma = require('../../config/prisma.config');

const{ ErrorWithStatusCode, handleError } = require("../../middleware/errorHandler")

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
    getAirportByCityCode
}