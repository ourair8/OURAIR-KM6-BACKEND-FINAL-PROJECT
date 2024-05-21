const { transporter } = require("../../../libs/nodemailer.lib")

const SERVER_EMAIL = String(process.env.SERVER_EMAIL);

const sendEmail = async function(email, otp) {

    try {

    await transporter.sendMail({
        from: SERVER_EMAIL,
        to: `${email}`, 
        subject: "Welcome to Andya Website",
        html: `
            <html>
                <head>
                    <style>
                        /* CSS untuk styling */
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #fff;
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        h1 {
                            color: #333;
                            text-align: center;
                        }
                        p {
                            color: #666;
                        }
                        .verification-token {
                            background-color: #007bff;
                            color: #fff;
                            padding: 10px;
                            border-radius: 5px;
                            text-align: center;
                            font-weight: bold;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Welcome to Andya Website</h1>
                        <p>Congratulations! You've successfully registered on Andya Website.</p>
                        <p>Explore and enjoy the features of our platform.</p>
                        <p>Enter this token to be verificated</p>
                        <h2>${otp}</h2>
                    </div>
                </body>
            </html>
        `,
    })

    return true

    } catch(err) {
        throw err
    }
} 

module.exports = { sendEmail };