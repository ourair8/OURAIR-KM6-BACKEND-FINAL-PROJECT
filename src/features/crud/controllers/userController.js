'use strict'

const {
    getAllUsersService,
    getUserByIdService,
    createUserService,
    updateUserService,
    deleteUserService,
    deleteUserManyService
} = require('../services/userService');

const { handleError } = require('../../../middleware/errorHandler');

const getAllUsersController = async(req, res) => {
    try {

        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 10;

        const users = await getAllUsersService(page, limit);
        res.status(200).json(users);
    } catch (err) {
        
        handleError(err, res);
    }
};

const getUserByIdController = async(req, res) => {
    try {
        const user = await getUserByIdService(parseInt(req.params.id));
        res.status(200).json(user);
    } catch (err) {
        handleError(err, res);
    }
};

const createUserController = async (req, res) => {
    try {
        const { name, email, password, role, phone_number } = req.body;

        if (!name || typeof name !== 'string' || name.length < 3 || name.length > 50) {
            return res.status(400).json({ message: 'Name must be a string between 3 and 50 characters' });
        }

        // if (!username || typeof username !== 'string' || username.length < 3 || username.length > 30) {
        //     return res.status(400).json({ message: 'Username must be a string between 3 and 30 characters' });
        // }

        if (!email || typeof email !== 'string') {
            return res.status(400).json({ message: 'Email must be a string' });
        }

        // if (!phone_number || typeof phone_number !== 'string' || phone_number.length < 10 || phone_number.length > 15) {
        //     return res.status(400).json({ message: 'Phone number must be a string between 10 and 15 characters' });
        // }

        if (!password || typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ message: 'Password must be a string with at least 6 characters' });
        }

        if (!role || typeof role !== 'string') {
            return res.status(400).json({ message: 'Role must be a string' });
        }

        const data = { name, email, password, role, phone_number };
        const user = await createUserService(data);
        res.status(201).json({ message: 'User created successfully', user });
    } catch (err) {
        handleError(err, res)
    }
};

const updateUserController = async(req, res) => {
    try {
        const user = await updateUserService(parseInt(req.params.id), req.body);
        res.status(200).json(user);
    } catch (err) {
        handleError(err, res);
    }
};

const deleteUserController = async(req, res) => {
    try {
        // const id = req.params.id
        // 
        await deleteUserService(parseInt(req.params.id));
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        handleError(err, res);
    }
};

const prisma = require('../../../config/prisma.config');
const { ErrorWithStatusCode } = require('../../../middleware/errorHandler');

const getUserData = async(req, res) => {
    try {
        return res.json({
            status: true,
            message: "success",
            data: await prisma.users.findUnique({
                where: {
                    id: 1
                }
            })
        })
    } catch (err) {
        handleError(err, res);
    }
}



module.exports = {
    getAllUsersController,
    getUserByIdController,
    createUserController,
    updateUserController,
    deleteUserController,
};