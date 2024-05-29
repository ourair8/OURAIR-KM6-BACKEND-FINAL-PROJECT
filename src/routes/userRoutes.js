'use strict'

const { checkRole, verifyToken } = require('../features/auth/controllers/whoAmI');

const express = require('express');
const {
    getAllUsersController,
    getUserByIdController,
    createUserController,
    updateUserController,
    deleteUserController,
} = require('../features/crud/controllers/userController');

const userRoutes = express.Router()
    .get('/', verifyToken, checkRole(['ADMIN']), getAllUsersController)
    .get('/:id', verifyToken, checkRole(['ADMIN']), getUserByIdController)
    .post('/', verifyToken, checkRole(['ADMIN']), createUserController)
    .put('/:id', verifyToken, checkRole(['user']), updateUserController)
    .delete('/:id', verifyToken, checkRole(['ADMIN']), deleteUserController)

module.exports = { userRoutes };