import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  transactionDate: { type: Date, required: true },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;