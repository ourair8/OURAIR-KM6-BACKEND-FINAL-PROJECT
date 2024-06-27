'use strict';

const { updateTransactionStatus } = require('../service/webhookService');
const { handleError } = require("../../../middleware/errorHandler");
const prisma = require('../../../config/prisma.config');

const handleWebhook = async(req, res) => {
    try {
        const { order_id, transaction_status, payment_type } = req.body;
        const  token = req.token
        console.log(token)

        const status = await updateTransactionStatus(order_id, transaction_status, payment_type);
        const notification = await prisma.notifications.create({
            data : {
                user_id : req.user.id,
                title : 'payment',
                message : 'Your booking payment is success !',
                is_read : false
            }
        })

        const io = req.app.get('io');
        io.emit(`transaction-update-${token}`, { notification, order_id, transaction_status, payment_type, status });

        res.status(200).json({ message: 'Transaction status and payment information updated successfully.', status });
    } catch (error) {
        console.error(error);
        handleError(error, res);
    }
};


//notif -> post-booking
//notif -> udah-bayar

module.exports = {
    handleWebhook
};