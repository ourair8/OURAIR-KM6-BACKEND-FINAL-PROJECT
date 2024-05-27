const { transporter, getHTML } = require("../../../libs/nodemailer.lib")

const SERVER_EMAIL = String(process.env.SERVER_EMAIL);

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

module.exports = { sendEmail };