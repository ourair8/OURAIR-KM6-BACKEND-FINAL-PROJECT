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
        console.log(err)
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

const createUserController = async(req, res) => {
    try {
        const user = await createUserService(req.body);
        res.status(201).json(user);
    } catch (err) {
        handleError(err, res);
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