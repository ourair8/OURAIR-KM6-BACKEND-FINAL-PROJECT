'use strict'

const snap = require('../../../config/midtrans');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTransaction(orderDetails) {
    const transaction = await snap.createTransaction(orderDetails);
    console.log(transaction)
    return transaction;
}

const saveTransactionToDB = async (transactionDetails) => {
    return await prisma.transactions.create({
        data: {
            paid: transactionDetails.paid,
            adult_price: transactionDetails.adult_price,
            baby_price: transactionDetails.baby_price,
            tax_price: transactionDetails.tax_price,
            total_price: transactionDetails.total_price,
            status: transactionDetails.status,
            created_at: transactionDetails.created_at,
            midtrans_order_id: transactionDetails.midtrans_order_id,
        }
    });
};

module.exports = {
    createTransaction,
    saveTransactionToDB
};