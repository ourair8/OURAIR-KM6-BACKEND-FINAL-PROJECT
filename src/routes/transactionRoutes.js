'use strict'
const express = require('express');

const { checkRole, verifyToken } = require('../features/auth/controllers/whoAmI');
const { getTransactionHistoryController } = require('../features/transactions/controllers/transactionHistoryController');

const transactionRoutes = express.Router()
    .get("/history", verifyToken, checkRole(['user']), getTransactionHistoryController)

module.exports = { transactionRoutes };