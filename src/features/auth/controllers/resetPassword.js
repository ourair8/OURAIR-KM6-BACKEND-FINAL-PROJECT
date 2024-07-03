'use strict'

const prisma = require("../../../config/prisma.config")
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt")

const{ ErrorWithStatusCode, handleError } = require("../../../middleware/errorHandler")
const SECRET_KEY = process.env.JWT_SECRET_KEY

const resetPassword = async function(req, res) {
    try {
        const { authorization } = req.headers
        const { password } = req.body
        if(!req.body.password) {
            throw new ErrorWithStatusCode(`please enter the password`, 401)
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        if (!authorization || !authorization.split(' ')[1]) {
            return res.json({
                status: false,
                message: 'token not provided!',
                data: null
            }).status(401);
        }
        let token = authorization.split(' ')[1];
        jwt.verify(token, SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Failed to authenticate token' });
            }
            const result = await prisma.users.update({
                where : {
                    id : decoded.id
                }, data : {
                    password : hashedPassword
                }
            })
            const payload = {
                id : result.id,
                name : result.name,
                email : result.email,
                phone_number : result.phone_number,
                isVerified : result.is_Verified,
                role : result.role
            }

            const newToken = jwt.sign(payload, SECRET_KEY)

            return res.json({
                status : true,
                message : `success`,
                data : {...payload, newToken}

            })
        });

    } catch (err) {
        
        handleError(err, res)
    }
}

module.exports = {
    resetPassword
}