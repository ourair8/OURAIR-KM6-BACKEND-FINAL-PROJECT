'use strict'

const express = require('express');
const { verifyToken, checkRole } = require('../features/auth/controllers/whoAmI');
const { getTransactionHistoryController } = require('../features/transactions/controllers/transactionHistoryController');
const { handleCreateTransaction } = require('../features/transactions/controllers/transactionnMidtrans');

const transactionRoutes = express.Router();

transactionRoutes.get('/history', verifyToken, checkRole(['USER']), getTransactionHistoryController);
transactionRoutes.post('/create-transaction-midtrans', verifyToken, checkRole(['USER']), handleCreateTransaction);

module.exports = { transactionRoutes };