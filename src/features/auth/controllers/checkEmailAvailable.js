'use strict'

const prisma = require("../../../config/prisma.config")
const{ ErrorWithStatusCode } = require("../../../middleware/errorHandler")

const isEmailAvailable = async function(req, res) {
    const email = await req.body.email
    try {
        const isEmail = await prisma.users.findUnique({
            where : {
                email : email
            }
        })

        if(!isEmail) {
            throw new ErrorWithStatusCode(`user with email ${email} is not exist`)
        }

        return true

    } catch (err) {
        if(err instanceof ErrorWithStatusCode) {
            handleError(err, res);
        }
        throw err
    }
}

module.exports = {
    isEmailAvailable
}