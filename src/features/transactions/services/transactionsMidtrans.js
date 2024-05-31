const snap = require('../../../config/midtrans');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTransaction(orderDetails) {
    const transaction = await snap.createTransaction(orderDetails);
    return transaction;
}

async function saveTransactionToDB(transactionDetails) {
    const transaction = await prisma.transactions.create({
        data: transactionDetails
    });
    return transaction;
}

module.exports = {
    createTransaction,
    saveTransactionToDB
};