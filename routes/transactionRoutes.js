import express from "express";
import protect from "../middlewares/protect.js";
import {
  deleteTransaction,
  updateTransaction,
  addTransaction,
} from "../controllers/TransactionController.js";

const router = express.Router();

router
  .delete("/:transactionId", protect, deleteTransaction)
  .put("/:transactionId", protect, updateTransaction)
  .post("/", protect, addTransaction);

export default router;
