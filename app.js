import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import apiCall from "./utils/apiCall.js";
import UserRoutes from "./routes/UserRoutes.js";
import TransactionRoutes from "./routes/transactionRoutes.js";
import { protect } from "./middlewares/protect.js";
import Transaction from "./models/TransactionModel.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Database connection
async function connectDB() {
  await mongoose.connect(process.env.DB_URL);
}
connectDB()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: "https://cents-ai.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Routes setup
app.use("/users", UserRoutes);
app.use("/transactions", TransactionRoutes);

app.get("/dashboard", protect, async (req, res, next) => {
  try {
    const txns = await Transaction.find({ userId: req.user.id });
    res.status(200).json({ transactions: txns });
  } catch (err) {
    next(err);
  }
});

app.post("/api/putdata", protect, async (req, res, next) => {
  try {
    const apiResponse = await apiCall(req.body);
    const match = apiResponse.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = match ? match[1] : apiResponse;
    const parsedData = JSON.parse(jsonString);

    for (let item of parsedData) {
      let t = new Transaction({
        userId: req.user.id,
        amount: item.amount,
        date: new Date(item.transactionDate),
        category: item.category,
      });
      await t.save();
    }

    res.status(200).json(parsedData);
  } catch (error) {
    next(error);
  }
});

// Catch-all route for unknown paths
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    error: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
