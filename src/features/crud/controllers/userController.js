const {
    getAllUsersService,
    getUserByIdService,
    createUserService,
    updateUserService,
    deleteUserService,
} = require('../services/userService');
const { ErrorWithStatusCode } = require('../../../config/prisma.config');

const getAllUsersController = async(req, res) => {
    try {
        const users = await getAllUsersService();
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
        await deleteUserService(parseInt(req.params.id));
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        handleError(err, res);
    }
};

const handleError = (err, res) => {
    if (err instanceof ErrorWithStatusCode) {
        res.status(err.statusCode).json({ message: err.message });
    } else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getAllUsersController,
    getUserByIdController,
    createUserController,
    updateUserController,
    deleteUserController,
};