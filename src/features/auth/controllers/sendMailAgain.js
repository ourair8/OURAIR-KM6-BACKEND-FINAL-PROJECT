'use strict'

const { sendEmailAgain } = require("../services/sendmail")
const{ handleError } = require("../../../middleware/errorHandler")

const sendEmailAgainController = async function(req, res) {

    const email = await req.body.email

    try {
        const result = await sendEmailAgain(email)

        if(!result){
            return res.json({
                status : false,
                message : 'bad request'
            }).status(401)
        }

        return res.json({
            status : true,
            message : `new OTP already sent to ${email}`
        }).status(201)


    } catch (err) {
        handleError(err, res);
    }
}

module.exports = {
    sendEmailAgainController
}