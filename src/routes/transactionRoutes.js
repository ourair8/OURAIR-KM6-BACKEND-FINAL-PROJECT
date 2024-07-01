'use strict'

// import { tr } from '@faker-js/faker';

const express = require('express');
const { verifyToken, checkRole } = require('../features/auth/controllers/whoAmI');
const { getTransactionHistoryController, getTransactionById } = require('../features/transactions/controllers/transactionHistoryController');
const {
    handleCreateTransaction,
    handleGetTransaction,
    handleUpdateTransaction,
    handleDeleteTransaction,
} = require("../features/transactions/controllers/transactionnMidtrans");
const { checkPaymentStatus } = require('../features/transactions/controllers/checkPaymentStatusController');


const transactionRoutes = express.Router();

transactionRoutes.get('/search-transaction-history', verifyToken, checkRole(["ADMIN", 'USER']), getTransactionById);
transactionRoutes.get('/history', verifyToken, checkRole(["ADMIN", 'USER']), getTransactionHistoryController);
transactionRoutes.post('/create-transaction-midtrans', verifyToken, checkRole(["ADMIN", 'USER']), handleCreateTransaction);
transactionRoutes.get('/:id', verifyToken, checkRole(['ADMIN', 'USER']), handleGetTransaction);
transactionRoutes.put('/:id', verifyToken, checkRole(['ADMIN', 'USER']), handleUpdateTransaction);
transactionRoutes.delete('/:id', verifyToken, checkRole(['ADMIN', 'USER']), handleDeleteTransaction);
transactionRoutes.get('/check-payment-status/:order_id', verifyToken, checkPaymentStatus);

module.exports = { transactionRoutes };