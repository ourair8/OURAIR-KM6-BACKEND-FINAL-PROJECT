'use strict'

const prisma = require("../../../config/prisma.config")
const { transporter, getHTML } = require("../../../libs/nodemailer.lib")
const SERVER_EMAIL = String(process.env.SERVER_EMAIL);
const{ ErrorWithStatusCode } = require("../../../middleware/errorHandler")

const sendEmail = async function(name, email, otp) {

    try {

    let html = await getHTML("email.ejs", {name : name, otp : otp})

    await transporter.sendMail({
        from: SERVER_EMAIL,
        to: `${email}`, 
        subject: "Welcome to Ourair",
        html: html
    })

    return true

    } catch(err) {
        throw err
    }
} 


const sendEmailAgain = async function(email) {
    try {

        const user = await prisma.users.findUnique({
            where : {
                email : email
            }
        })

        if(!user){
            throw new ErrorWithStatusCode("Email is not exist", 404)
        }

        const otp = generateOTP()
        const currentTime = new Date();
        const expiredAt = new Date(currentTime.getTime() + 10 * 60000);
   
        await prisma.otps.create({
           data : {
               otp_code : String(otp),
               created_at : new Date(),
               expired_at : expiredAt,
               user_id : user.id
           }
        })

        let html = await getHTML("email.ejs", {name : user.name, otp : otp})
    
        await transporter.sendMail({
            from: SERVER_EMAIL,
            to: `${email}`, 
            subject: "Welcome to Ourair",
            html: html
        })
    
        return true
    
        } catch(err) {
            throw err
        }
}


function generateOTP() {
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += Math.floor(Math.random() * 10); 
    }
    return otp;
}


module.exports = { sendEmail, sendEmailAgain };