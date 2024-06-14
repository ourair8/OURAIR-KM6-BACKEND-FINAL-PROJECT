'use strict';

const prisma = require('../../../config/prisma.config');

const updateTransactionStatus = async(orderId, transactionStatus, paymentType) => {
    let status = false;
    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
        status = true;
    } else if (transactionStatus === 'deny' || transactionStatus === 'cancel' || transactionStatus === 'expire') {
        status = false;
    }


    const transaction = await prisma.transactions.findUnique({
        where: { midtrans_order_id: orderId },
        include: {
            Payments: true
        }
    });

    if (!transaction) {
        throw new Error(`Transaction with orderId ${orderId} not found.`);
    }


    await prisma.transactions.update({
        where: { midtrans_order_id: orderId },
        data: { status: status }
    });


    if (!transaction.Payments) {
        await prisma.payments.create({
            data: {
                transaction_id: transaction.id,
                payment_type: paymentType,
                payment_status: transactionStatus,
                created_at: new Date()
            }
        });
    } else {

        await prisma.payments.update({
            where: { id: transaction.Payments.id },
            data: {
                payment_type: paymentType,
                payment_status: transactionStatus
            }
        });
    }

    return status;
};

module.exports = {
    updateTransactionStatus
};
