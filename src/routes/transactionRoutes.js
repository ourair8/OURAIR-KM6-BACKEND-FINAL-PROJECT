'use strict'

// import { tr } from '@faker-js/faker';

const express = require('express');
const { verifyToken, checkRole } = require('../features/auth/controllers/whoAmI');
const { getTransactionHistoryController } = require('../features/transactions/controllers/transactionHistoryController');
const {
  handleCreateTransaction,
  handleGetTransaction,
  handleUpdateTransaction,
  handleDeleteTransaction,
} = require("../features/transactions/controllers/transactionnMidtrans");
const { checkPaymentStatus } = require('../features/transactions/controllers/checkPaymentStatusController');


const transactionRoutes = express.Router();

transactionRoutes.get('/history', verifyToken, checkRole(['USER']), getTransactionHistoryController);
transactionRoutes.post('/create-transaction-midtrans', verifyToken, checkRole(['USER']), handleCreateTransaction);
transactionRoutes.get('/get-transaction/:id', verifyToken, checkRole(['ADMIN']), handleGetTransaction);
transactionRoutes.put('/update-transaction/:id', verifyToken, checkRole(['ADMIN']), handleUpdateTransaction);
transactionRoutes.delete('/delete-transaction/:id', verifyToken, checkRole(['ADMIN']), handleDeleteTransaction);
transactionRoutes.get('/check-payment-status/:order_id', verifyToken, checkPaymentStatus);

module.exports = { transactionRoutes };