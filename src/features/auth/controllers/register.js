const { registerUser } = require("../services/register")
const { sendEmail } = require("../services/sendmail")
const { ErrorWithStatusCode } = require('./../../../middleware/errorHandler');

const registerUserController = async function(req, res){

    try {

    console.log("Checkpoint")

    const {name, email, phoneNumber, password} = req.body

    const otp = await registerUser(name, email, phoneNumber, password)

    console.log("otp", otp)

    if (!otp) {
        throw new ErrorWithStatusCode("Error unexpected", 401)
    }

    const isEmailSuccess = await sendEmail(email, otp)

    if(!isEmailSuccess) {
        throw new ErrorWithStatusCode("Error unexpected", 401)
    }

    return res.json({
        status : true,
        message : `OTP code is sent to ${email}`
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

module.exports = { registerUserController };