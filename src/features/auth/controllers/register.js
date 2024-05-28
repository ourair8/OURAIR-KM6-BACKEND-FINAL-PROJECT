'use strict'

const { registerUser } = require("../services/register")
const { sendEmail } = require("../services/sendmail")
const { ErrorWithStatusCode, handleError } = require('./../../../middleware/errorHandler');

const registerUserController = async function(req, res){

    try {

    console.log("Checkpoint")

    const {name, email, password} = req.body

    const otp = await registerUser(name, email, password)

    console.log("otp", otp)

    if (!otp) {
        throw new ErrorWithStatusCode("Error unexpected", 401)
    }

    const isEmailSuccess = await sendEmail(name, email, otp)

    if(!isEmailSuccess) {
        throw new ErrorWithStatusCode("Error unexpected", 401)
    }

    return res.json({
        status : true,
        message : `OTP code is sent to ${email}`
    }).status(201)

    } catch (err) {
        console.log(err)
        handleError(err, res);
    } 

}

module.exports = { registerUserController };