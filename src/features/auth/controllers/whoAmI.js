'use strict'

const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_KEY

const verifyToken = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.split(' ')[1]) {
        return res.status(401).json({
            status: false,
            message: 'Token not provided!',
            data: null
        });
    }

    let token = authorization.split(' ')[1];

    console.log(token);
    console.log(SECRET_KEY)
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            console.log(err)
            return res.status(401).json({ 
                status: false,
                message: 'Failed to authenticate token',
                data: null 
            });
        }

        req.user = decoded;
        next();
    });
};

const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            console.log(req.user.role)
            return res.status(403).json({ message: 'Access forbidden: insufficient rights' });
        }

        // if(req.user.role !== 'ADMIN') {
        //     return res.status(403).json({ message: 'Access forbidden: insufficient rights' });
        // }
        next();
    };
};

const whoAmIController = (req, res) => {
    try {
        const { id, name, username, email, phone_number, isVerified, role } = req.user;

        res.json({
            status: true,
            message: 'User authenticated',
            data: {
                id,
                name,
                username,
                email,
                phone_number,
                isVerified,
                role
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const whoIAm = (req, res) => {

    try {
    const { authorization } = req.headers

    

    if (!authorization || !authorization.split(' ')[1]) {
        return res.json({
            status: false,
            message: 'token not provided!',
            data: null
        }).status(401);
    }

    let token = authorization.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }

        return res.json({
            status : true,
            message : 'success',
            data : decoded
        })
    })


    } catch(err) {
        throw err
    }
}

module.exports = {
    verifyToken,
    checkRole,
    whoAmIController,
    whoIAm
};
