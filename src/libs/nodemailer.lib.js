'use strict'

const nodemailer = require('nodemailer');
const ejs = require('ejs');

const SERVER_HOST = String(process.env.SERVER_HOST);
const SERVER_EMAIL = String(process.env.SERVER_EMAIL);
const SERVER_PASSWORD = String(process.env.SERVER_PASS);


const transporter = nodemailer.createTransport({
    host: SERVER_HOST,
    port: 465,
    secure: true,
    auth: {
        user: SERVER_EMAIL,
        pass: SERVER_PASSWORD
    },
});

const getHTML = (fileName, data) => {
    return new Promise((resolve, reject) => {
        const path = `${__dirname}/../views/${fileName}`;
        ejs.renderFile(path, data, (err, data) => {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
    });
};


module.exports = { transporter, getHTML };
