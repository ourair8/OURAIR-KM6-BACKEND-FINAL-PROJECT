'use strict';

const { updateTransactionStatus } = require('../service/webhookService');
const { handleError } = require("../../../middleware/errorHandler");
const { sendNotification } = require('../../../config/websocket');

const handleWebhook = async(req, res) => {
    try {
        const { order_id, transaction_status } = req.body;

        const status = await updateTransactionStatus(order_id, transaction_status);


        const transaction = await prisma.transactions.findUnique({
            where: { midtrans_order_id: order_id },
            include: { tickets: true }
        });
        const user_id = transaction.tickets[0].user_id;


        sendNotification(user_id, {
            message: 'Transaction status updated',
            status: transaction_status
        });


        await prisma.notifications.create({
            data: {
                user_id: user_id,
                title: 'Transaction Status Updated',
                message: `Your transaction status is now ${transaction_status}.`,
                is_read: false,
                created_at: new Date()
            }
        });

        res.status(200).json({ message: 'Transaction status updated successfully.', status });
    } catch (error) {
        console.error(error);
        handleError(error, res);
    }
};

module.exports = {
    handleWebhook
};