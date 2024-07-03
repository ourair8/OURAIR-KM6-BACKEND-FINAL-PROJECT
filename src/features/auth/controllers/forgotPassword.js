'use strict'

const prisma = require("../../../config/prisma.config")
const jwt = require('jsonwebtoken');

const{ ErrorWithStatusCode, handleError } = require("../../../middleware/errorHandler")
const { transporter, getHTML } = require("../../../libs/nodemailer.lib")
const SERVER_EMAIL = String(process.env.SERVER_EMAIL);

const SECRET_KEY = process.env.JWT_SECRET_KEY

const checkEmailSendTokentoEmail = async function(req, res) {
    try {
        const { email }  = req.body

        

        if(!email){
            throw new ErrorWithStatusCode("please enter the email", 401)
        }
        
        const result = await prisma.users.findUnique({
            where : {
                email : email
            }
        })

        if(!result){
            throw new ErrorWithStatusCode(`email is not exist`, 404)
        }

        const payload = {
            id : result.id,
            name : result.name,
            email : result.email,
            phone_number : result.phone_number,
            isVerified : result.is_Verified,
            role : result.role
        }

        

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });

        
        let link = `https://ourair.tech/ganti-password/${token}`

        
        let html = await getHTML("forgotPwEmail.ejs", {name : result.name, resetPasswordUrl : link})
        
        await transporter.sendMail({
            from: SERVER_EMAIL,
            to: `${email}`, 
            subject: "Ourair, Reset password",
            html: html
        })


        return res.status(200).json({
            status : true,
            message : `link for reset password already sent`
        })

    } catch(err) {
        
        handleError(err, res)
    }

}

module.exports = {
    checkEmailSendTokentoEmail
}