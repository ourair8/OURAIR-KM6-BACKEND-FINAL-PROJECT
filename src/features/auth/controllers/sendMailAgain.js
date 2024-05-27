'use strict'

const{ ErrorWithStatusCode } = require("../../../middleware/errorHandler")
const { sendEmailAgain } = require("../services/sendmail")

const sendEmailAgainController = async function(req, res) {

    const email = await req.body.email

    try {
        const result = sendEmailAgain(email)

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
        if(err instanceof ErrorWithStatusCode) {
            handleError(err, res);
        }
        throw err
    }
}

module.exports = {
    sendEmailAgainController
}