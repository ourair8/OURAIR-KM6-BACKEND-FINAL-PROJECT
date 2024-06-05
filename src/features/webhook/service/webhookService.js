'use strict';

const prisma = require('../../../config/prisma.config');

const updateTransactionStatus = async(orderId, transactionStatus) => {
    let status = false;
    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
        status = true;
    } else if (transactionStatus === 'deny' || transactionStatus === 'cancel' || transactionStatus === 'expire') {
        status = false;
    }

    await prisma.transactions.update({
        where: { midtrans_order_id: orderId },
        data: { status: status }
    });

    return status;
};

module.exports = {
    updateTransactionStatus
};