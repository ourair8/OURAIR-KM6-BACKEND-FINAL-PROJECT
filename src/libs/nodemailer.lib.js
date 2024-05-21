const nodemailer = require('nodemailer');

const SERVER_HOST = String(process.env.SERVER_HOST);
const SERVER_EMAIL = String(process.env.SERVER_EMAIL);
const SERVER_PASSWORD = String(process.env.SERVER_PASS);


const transporter = nodemailer.createTransport({
    host: SERVER_HOST,
    port: 587,
    auth: {
        user: SERVER_EMAIL,
        pass: SERVER_PASSWORD
    },
});

module.exports = { transporter };
