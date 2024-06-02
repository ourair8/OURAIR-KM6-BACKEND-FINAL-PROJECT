'use strict'

const { ErrorWithStatusCode, handleError } = require('./../../../middleware/errorHandler');
const { verifyOTP } = require("../services/verifyOTP")

const verifyOTPController = async function(req, res){

    try {

    

    const {email, otp } = req.body

    const result = await verifyOTP(email, otp)

    if(!result){
        throw new ErrorWithStatusCode("error Verifying OTP unexpected", 401)
    }

    return res.status(201).json({
        status : true,
        message : `email verification is success`
    })

    } catch (err) {
        handleError(err, res);
    } 

}

module.exports = { verifyOTPController };