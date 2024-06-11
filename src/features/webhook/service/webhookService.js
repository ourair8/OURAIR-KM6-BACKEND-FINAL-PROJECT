'use strict';

const prisma = require('../../../config/prisma.config');

const updateTransactionStatus = async(order_id, transaction_status) => {
    const transaction = await prisma.transactions.findUnique({
        where: { midtrans_order_id: order_id }
    });

    if (!transaction) {
        throw new Error('Transaction not found');
    }

    const updatedTransaction = await prisma.transactions.update({
        where: { id: transaction.id },
        data: { status: transaction_status === 'settlement' }
    });

    // Add notification
    const notification = await prisma.notifications.create({
        data: {
            user_id: transaction.user_id,
            title: 'Transaction Update',
            message: `Your transaction with order ID ${order_id} is ${transaction_status}.`,
            is_read: false,
            created_at: new Date()
        }
    });

    // Emit WebSocket event
    global.io.emit(`notification-${transaction.user_id}`, notification);

    return updatedTransaction;
};

module.exports = {
    updateTransactionStatus
};