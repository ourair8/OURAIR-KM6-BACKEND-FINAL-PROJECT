'use strict'

const prisma = require("../../../config/prisma.config")
const bcrypt = require("bcrypt")

const { ErrorWithStatusCode } = require('./../../../middleware/errorHandler');

const loginByEmailService = async function(email, password){
    try {

        const isEmail = await prisma.users.findUnique({
            where : {
                email : email
            }
        })

        if(!isEmail) {
            throw new ErrorWithStatusCode("email is not registered !", 404)
        }

        const result = await bcrypt.compare(password, isEmail.password)

        if(!result) {
            throw new ErrorWithStatusCode("password is not match !", 409)
        }

        return isEmail

    } catch (err) {
        throw err
    }
}

module.exports = { loginByEmailService }