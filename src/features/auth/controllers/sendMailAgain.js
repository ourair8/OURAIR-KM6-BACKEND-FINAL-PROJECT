'use strict'

const { sendEmailAgain } = require("../services/sendmail")
const{ handleError } = require("../../../middleware/errorHandler")

const sendEmailAgainController = async function(req, res) {

    const email = req.body.email

    try {
        const result = await sendEmailAgain(email)

        if(!result){
            return res.status(401).json({
                status : false,
                message : 'bad request'
            })
        }

        return res.status(201).json({
            status : true,
            message : `new OTP already sent to ${email}`
        })


    } catch (err) {
        console.log(err)
        handleError(err, res);
    }
}

module.exports = {
    sendEmailAgainController
}