'use strict'

const express = require('express');
const { verifyToken, checkRole } = require('../features/auth/controllers/whoAmI');
const { getTransactionHistoryController } = require('../features/transactions/controllers/transactionHistoryController');
const { handleCreateTransaction } = require('../features/transactions/controllers/transactionnMidtrans');

const transactionRoutes = express.Router();

transactionRoutes.get('/', verifyToken, checkRole(['user']), getTransactionHistoryController);
transactionRoutes.post('/create-transaction-midtrans', verifyToken, checkRole(['user']), handleCreateTransaction);

module.exports = { transactionRoutes };