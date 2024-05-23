const express = require('express');
const {
    getAllUsersController,
    getUserByIdController,
    createUserController,
    updateUserController,
    deleteUserController,
} = require('../features/crud/controllers/userController');

const userRoutes = express.Router();

userRoutes.get('/', getAllUsersController);
userRoutes.get('/:id', getUserByIdController);
userRoutes.post('/', createUserController);
userRoutes.put('/:id', updateUserController);
userRoutes.delete('/:id', deleteUserController);

module.exports = { userRoutes };