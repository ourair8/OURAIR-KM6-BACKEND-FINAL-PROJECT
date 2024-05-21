const { ErrorWithStatusCode } = require('./../../../middleware/errorHandler');
const { verifyOTP } = require("../services/verifyOTP")

const verifyOTPController = async function(req, res){

    try {

    console.log("Checkpoint")

    const {email, otp } = req.body

    const result = await verifyOTP(email, otp)

    if(!result){
        throw new ErrorWithStatusCode("error Verifying OTP unexpected", 401)
    }

    return res.json({
        status : true,
        message : `email verification is success`
    }).status(201)

    } catch (err) {
        if (err instanceof ErrorWithStatusCode) {
            return res.json({
                status: false,
                message: err.message
            }).status(err.statusCode)
        }

        throw err
    } 

}

module.exports = { verifyOTPController };