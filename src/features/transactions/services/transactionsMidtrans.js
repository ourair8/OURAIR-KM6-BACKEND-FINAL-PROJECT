"use strict";

const { ErrorWithStatusCode, handleError } = require("../../../middleware/errorHandler");

const snap = require("../../../config/midtrans");
// const { PrismaClient } = require("@prisma/client");
const prisma = require("../../../config/prisma.config");

const createTransaction = async (orderDetails) => {
  try {
    const transaction = await snap.createTransaction(orderDetails);
    return transaction;
  } catch (error) {
    throw new Error('Failed to create transaction');
  }
};

const saveTransactionToDB = async (transactionDetails) => {
  try {
    const transaction = await prisma.transactions.create({
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
    return transaction;
  } catch (error) {
    throw new Error('Failed to save transaction to database');
  }
};

const getTransactionById = async (id) => {
  try {
    const transaction = await prisma.transactions.findUnique({
      where: { id: Number(id) },
    });
    return transaction;
  } catch (error) {
    throw new Error('Failed to get transaction by ID');
  }
};

const updateTransaction = async (id, updateData) => {
  try {

    const isexist = await prisma.transactions.findUnique({
      where : {
        id : Number(id)
      }
    })

    if(!isexist) {
      throw new ErrorWithStatusCode(`transaction with id ${id} is not exist`, 404)
    }

    const transaction = await prisma.transactions.update({
      where: { id: Number(id) },
      data: {
        midtrans_order_id : updateData.midtrans_order_id,
        adult_price : Number(updateData.adult_price),
        baby_price : Number(updateData.baby_price),
        tax_price : Number(updateData.tax_price),
        total_price : Number(updateData.total_price),
        status : updateData.status
      },
    });


    return transaction;
  } catch (error) {
    console.log(error)
    throw error
  }
};

const deleteTransaction = async (id) => {
  try {
    const transaction = await prisma.transactions.delete({
      where: { id: Number(id) },
    });
    return transaction;
  } catch (error) {
    throw new Error('Failed to delete transaction');
  }
};

module.exports = {
  createTransaction,
  saveTransactionToDB,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
