'use strict';

const { updateTransactionStatus } = require('../service/webhookService');
const { handleError } = require("../../../middleware/errorHandler");
const prisma = require('../../../config/prisma.config');

const handleWebhook = async (req, res) => {
    try {
        console.log(req.body)
        const { order_id, transaction_status, payment_type } = req.body;

        // if (transaction_status === "pending"){
        //     return res.json( {status : true })
        // }
        
        const transaction = await prisma.transactions.findUnique({
            where: {
                midtrans_order_id: order_id
            }
        });

        if (transaction.status == true) {
            const transaction_token = transaction.transaction_token;
            const io = req.app.get('io');
            io.emit(`transaction-update-${transaction_token}`, 'pembayaran sudah dilakukan');

            console.log('if')

            return res.json({
                status: false,
                message: 'pembayaran sudah dilakukan !'
            });
        } else {
            const { status, user } = await updateTransactionStatus(order_id, transaction_status, payment_type);

            const notification = await prisma.notifications.create({
                data: {
                    user_id: user,
                    title: 'Pembayaran Sukses',
                    message: 'Selamat pembayaran tiket Anda sukses !',
                    is_read: false,
                    created_at: new Date()
                }
            });

            console.log('else')

            const io = req.app.get('io');
            io.emit(`transaction-update-${transaction.transaction_token}`, {
                notification,
                order_id,
                transaction_status,
                payment_type,
                status,
                date: notification.created_at
            });

            res.status(200).json({ message: 'Selamat pembayaran tiket Anda sukses.', status });
        }
    } catch (error) {
        console.error(error);
        handleError(error, res);
    }
};



module.exports = {
    handleWebhook
};