'use strict'

const prisma = require('../../../config/prisma.config');

const updateTransactionHistory = async(historyData) => {
    return await prisma.transactionHistories.create({
        data: historyData
    });
};

module.exports = {
    updateTransactionHistory
};