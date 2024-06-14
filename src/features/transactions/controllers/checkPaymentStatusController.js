'use strict';

const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
const { handleError } = require('../../../middleware/errorHandler');

const checkPaymentStatus = async(req, res) => {
    const { order_id } = req.params;

    try {

        const transaction = await prisma.transactions.findUnique({
            where: { midtrans_order_id: order_id },
            include: {
                Payments: true
            }
        });

        if (!transaction) {
            return res.status(404).json({
                status: false,
                message: 'Transaction not found',
                data: null
            });
        }


        const payment = transaction.Payments;

        return res.status(200).json({
            status: true,
            message: 'Transaction status retrieved',
            data: {
                paid: transaction.status,
                payment: {
                    payment_type: payment.payment_type,
                    payment_status: payment.payment_status,
                    created_at: payment.created_at
                }
            }
        });
    } catch (error) {
        console.error(error);
        handleError(error, res);
    }
    // finally {
    //     await prisma.$disconnect(); 
    // }
};

module.exports = { checkPaymentStatus };