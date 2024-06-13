'use strict'

const { registerUser } = require("../services/register")
const { sendEmail } = require("../services/sendmail")
const { ErrorWithStatusCode, handleError } = require('./../../../middleware/errorHandler');

const registerUserController = async function(req, res){

    try {


    let { name, phone_number, email, password } = req.body
    phone_number = String(phone_number)
    
    const otp = await registerUser(name, phone_number, email, password)

    

    if (!otp) {
        throw new ErrorWithStatusCode("Error unexpected", 401)
    }

    const isEmailSuccess = await sendEmail(name, email, otp)

    if(!isEmailSuccess) {
        throw new ErrorWithStatusCode("Error unexpected", 401)
    }

    return res.status(201).json({
        status : true,
        message : `OTP code is sent to ${email}`
    })

    } catch (err) {
        console.log(err)
        handleError(err, res);
    } 

}

module.exports = { registerUserController };