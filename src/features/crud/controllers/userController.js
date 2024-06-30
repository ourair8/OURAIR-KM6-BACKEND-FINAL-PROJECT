'use strict';

const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../services/userService');
const { ErrorWithStatusCode } = require('../../../middleware/errorHandler');

const getAllUsersController = async(req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json({ status: true, message: 'Users fetched successfully', data: users });
    } catch (error) {
        handleError(err, res);
    }
};

const getUserByIdController = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await getUserById(id);
        if (!user) {
            throw new ErrorWithStatusCode('User not found', 404);
        }
        res.status(200).json({ status: true, message: 'User fetched successfully', data: user });
    } catch (error) {
        handleError(err, res);
    }
};

const createUserController = async(req, res) => {
    try {
        const userData = req.body;
        const newUser = await createUser(userData);
        res.status(201).json({ status: true, message: 'User created successfully', data: newUser });
    } catch (error) {
        handleError(err, res);
    }
};

const updateUserController = async(req, res) => {
    try {
        const { id } = req.params;
        const userData = req.body;
        const updatedUser = await updateUser(id, userData);
        res.status(200).json({ status: true, message: 'User updated successfully', data: updatedUser });
    } catch (error) {
        handleError(err, res);
    }
};

const deleteUserController = async(req, res) => {
    try {
        const { id } = req.params;
        await deleteUser(id);
        res.status(200).json({ status: true, message: 'User deleted successfully', data: null });
    } catch (error) {
        handleError(err, res);
    }
};

module.exports = {
    getAllUsersController,
    getUserByIdController,
    createUserController,
    updateUserController,
    deleteUserController
};