'use strict';

const { updateTransactionStatus } = require('../service/webhookService');
const { handleError } = require("../../../middleware/errorHandler");
const prisma = require('../../../config/prisma.config');

const handleWebhook = async(req, res) => {
    try {
        const { order_id, transaction_status, payment_type } = req.body;

        const { status, user } = await updateTransactionStatus(order_id, transaction_status, payment_type);

        const notification = await prisma.notifications.create({
            data : {
                user_id : user,
                title : 'sistem',
                message : 'Pembayaran tiket sukses !',
                is_read : false,
                created_at : new Date()
            }
        })

        const token = await prisma.users.findUnique({
            where : {
                id : user
            }
        })

        const io = req.app.get('io');
        io.emit(`transaction-update-${token.session_token}`, { notification, order_id, transaction_status, payment_type, status });

        res.status(200).json({ message: 'Transaction status and payment information updated successfully.', status });
    } catch (error) {
        console.error(error);
        handleError(error, res);
    }
};


module.exports = {
    handleWebhook
};