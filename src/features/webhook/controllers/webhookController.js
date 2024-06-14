'use strict';

const { updateTransactionStatus } = require('../service/webhookService');
const { handleError } = require("../../../middleware/errorHandler");

const handleWebhook = async(req, res) => {
    try {
        const { order_id, transaction_status, payment_type } = req.body;

        const status = await updateTransactionStatus(order_id, transaction_status, payment_type);

        res.status(200).json({ message: 'Transaction status and payment information updated successfully.', status });
    } catch (error) {
        console.error(error);
        handleError(error, res);
    }
};

module.exports = {
    handleWebhook
};