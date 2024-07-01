"use strict";

const snap = require("../../../config/midtrans");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createTransaction(orderDetails) {
  const transaction = await snap.createTransaction(orderDetails);
  ;
  return transaction;
}

const saveTransactionToDB = async (transactionDetails) => {
  return await prisma.transactions.create({
    data: {
      paid: transactionDetails.paid,
      adult_price: transactionDetails.adult_price,
      baby_price: transactionDetails.baby_price,
      tax_price: transactionDetails.tax_price,
      total_price: transactionDetails.total_price,
      status: transactionDetails.status,
      created_at: transactionDetails.created_at,
      midtrans_order_id: transactionDetails.midtrans_order_id,
    },
  });
};

const getTransactionById = async (id) => {
  return await prisma.transactions.findUnique({
    where: { id: Number(id) },
  });
};

const updateTransaction = async (id, updateData) => {
  return await prisma.transactions.update({
    where: { id: Number(id) },
    data: updateData,
  });
};

const deleteTransaction = async (id) => {
  return await prisma.transactions.delete({
    where: { id: Number(id) },
  });
};

module.exports = {
  createTransaction,
  saveTransactionToDB,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
