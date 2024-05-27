'use strict'

import { checkRole, verifyToken } from '../features/auth/controllers/whoAmI';

const express = require('express');
const {
    getAllUsersController,
    getUserByIdController,
    createUserController,
    updateUserController,
    deleteUserController,
} = require('../features/crud/controllers/userController');

const userRoutes = express.Router()
    .get('/', verifyToken, checkRole(['admin']), getAllUsersController)
    .get('/:id', verifyToken, checkRole(['admin']), getUserByIdController)
    .post('/', verifyToken, checkRole(['admin']), createUserController)
    .put('/:id', verifyToken, checkRole(['user']), updateUserController)
    .delete('/:id', verifyToken, checkRole(['admin']), deleteUserController)

module.exports = { userRoutes };