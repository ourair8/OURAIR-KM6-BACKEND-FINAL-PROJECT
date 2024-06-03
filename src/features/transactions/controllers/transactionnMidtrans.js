'use strict'

const { createTransaction } = require('../services/transactionsMidtrans');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const handleCreateTransaction = async(req, res) => {
    try {
        const { gross_amount, customer_details, adult_price, baby_price, tax_price } = req.body;

        const orderDetails = {
            transaction_details: {
                order_id: "order-id-node-" + Math.round((new Date()).getTime() / 1000),
                gross_amount: gross_amount
            },
            credit_card: {
                secure: true
            },
            customer_details: customer_details
        };

        const transaction = await createTransaction(orderDetails);

        const savedTransaction = await prisma.transactions.create({
            data: {
                midtrans_order_id: orderDetails.transaction_details.order_id,
                adult_price: adult_price,
                baby_price: baby_price,
                tax_price: tax_price,
                total_price: gross_amount,
                created_at: new Date(),
                status: false
            }
        });

        res.status(200).json({ transaction, savedTransaction });
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    handleCreateTransaction
};