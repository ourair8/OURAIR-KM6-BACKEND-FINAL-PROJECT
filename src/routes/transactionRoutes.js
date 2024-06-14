'use strict'

const express = require('express');
const { verifyToken, checkRole } = require('../features/auth/controllers/whoAmI');
const { getTransactionHistoryController } = require('../features/transactions/controllers/transactionHistoryController');
const { handleCreateTransaction } = require('../features/transactions/controllers/transactionnMidtrans');
const { checkPaymentStatus } = require('../features/transactions/controllers/checkPaymentStatusController');


const transactionRoutes = express.Router();

transactionRoutes.get('/history', verifyToken, checkRole(['USER']), getTransactionHistoryController);
transactionRoutes.post('/create-transaction-midtrans', verifyToken, checkRole(['USER']), handleCreateTransaction);
transactionRoutes.get('/check-payment-status/:order_id', verifyToken, checkPaymentStatus);

module.exports = { transactionRoutes };