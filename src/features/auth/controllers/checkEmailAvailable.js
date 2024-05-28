'use strict'

const prisma = require("../../../config/prisma.config")
const{ ErrorWithStatusCode, handleError } = require("../../../middleware/errorHandler")

const isEmailAvailable = async function(req, res) {
    const email = req.body.email

    console.log(email)

    try {
        const isEmail = await prisma.users.findUnique({
            where : {
                email : email
            }
        })

        if(!isEmail) {
            throw new ErrorWithStatusCode(`user with email ${email} is not exist`, 404)
        }

        return res.json({
            status: true,
            message : `success`
        })

    } catch (err) {
        handleError(err, res);
    }
}

module.exports = {
    isEmailAvailable
}