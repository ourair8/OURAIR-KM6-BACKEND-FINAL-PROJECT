"use strict";

const {
  createTransaction,
  saveTransactionToDB,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} = require("../services/transactionsMidtrans");

// const handleCreateTransaction = async (req, res) => {
//   try {
//     const orderDetails = {
//       transaction_details: {
//         order_id: "order-id-node-" + Math.round(new Date().getTime() / 1000),
//         gross_amount: req.body.gross_amount,
//       },
//       credit_card: {
//         secure: true,
//       },
//       customer_details: req.body.customer_details,
//     };

//     const transaction = await createTransaction(orderDetails);
//     const savedTransaction = await saveTransactionToDB({
//       midtrans_order_id: orderDetails.transaction_details.order_id,
//       adult_price: req.body.adult_price,
//       baby_price: req.body.baby_price,
//       tax_price: req.body.tax_price,
//       total_price: req.body.gross_amount,
//       created_at: new Date(),
//       status: false,
//     });

//     const createdPayment = await prisma.payments.create({
//       data: {
//         transaction_id: savedTransaction.id,
//         payment_type: transaction.payment_type,
//         payment_status: transaction.transaction_status,
//         created_at: new Date(),
//       },
//     });

//     res.status(200).json({ transaction, savedTransaction, createdPayment });
//   } catch (error) {
//     console.error("Error creating transaction:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const handleCreateTransaction = async (req, res) => {
  try {
    const orderDetails = {
      transaction_details: {
        order_id: "order-id-node-" + Math.round(new Date().getTime() / 1000),
        gross_amount: req.body.gross_amount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: req.body.customer_details,
    };

    const transaction = await createTransaction(orderDetails);
    const savedTransaction = await saveTransactionToDB({
      midtrans_order_id: orderDetails.transaction_details.order_id,
      adult_price: req.body.adult_price,
      baby_price: req.body.baby_price,
      tax_price: req.body.tax_price,
      total_price: req.body.gross_amount,
      created_at: new Date(),
      status: false,
    });

    const createdPayment = await prisma.payments.create({
      data: {
        transaction_id: createTransaction.id,
        payment_type: transaction.payment_type,
        payment_status: transaction.transaction_status,
        created_at: new Date(),
      },
    });

    res.status(200).json({ transaction, savedTransaction, createdPayment });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const handleGetTransaction = async (req, res) => {
  try {
    const transaction = await getTransactionById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    console.error("Error getting transaction:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const handleUpdateTransaction = async (req, res) => {
  try {
    const updateData = req.body;
    const updatedTransaction = await updateTransaction(
      req.params.id,
      updateData
    );
    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const handleDeleteTransaction = async (req, res) => {
  try {
    await deleteTransaction(req.params.id);
    res.status(204).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  handleCreateTransaction,
  handleGetTransaction,
  handleUpdateTransaction,
  handleDeleteTransaction,
};
