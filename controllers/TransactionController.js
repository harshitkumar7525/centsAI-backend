import Transaction from "../models/TransactionModel.js";
import expressAsyncHandler from "express-async-handler";

// @desc    Delete a transaction
// @route   DELETE /transactions/:transactionId
// @access  Private
export const deleteTransaction = expressAsyncHandler(async (req, res) => {
  const { transactionId } = req.params;

  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  if (transaction.userId.toString() !== req.user.id) {
    return res
      .status(403)
      .json({ message: "Not authorized to delete this transaction" });
  }

  await transaction.deleteOne();
  return res
    .status(200)
    .json({ message: "Transaction deleted successfully", transactionId });
});

// @desc    Update a transaction
// @route   PUT /transactions/:transactionId
// @access  Private
export const updateTransaction = expressAsyncHandler(async (req, res) => {
  const { transactionId } = req.params;
  const { amount, date, category } = req.body;

  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  if (transaction.userId.toString() !== req.user.id) {
    return res
      .status(403)
      .json({ message: "Not authorized to update this transaction" });
  }

  transaction.amount = amount ?? transaction.amount;
  transaction.date = date ? new Date(date) : transaction.date;
  transaction.category = category ?? transaction.category;

  const updatedTransaction = await transaction.save();
  return res.status(200).json({
    message: "Transaction updated successfully",
    transaction: updatedTransaction,
  });
});

// @desc    Add a transaction
// @route   POST /transactions
// @access  Private
export const addTransaction = expressAsyncHandler(async (req, res) => {
  const { amount, date, category } = req.body;
  const userId = req.user.id;
  const transaction = new Transaction({
    userId,
    amount,
    date: new Date(date),
    category,
  });
  await transaction.save();
  res
    .status(201)
    .json({ message: "Transaction added successfully", transaction });
});
