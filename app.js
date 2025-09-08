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
app.use(cors());

// Routes setup
app.use("/users", UserRoutes);
app.use("/transactions", TransactionRoutes);

app.get("/dashboard", protect, (req, res) => {
  const user = req.user;
  console.dir(user.id);
  res.status(200).json({ message: "Welcome to the dashboard!" });
});

app.post("/api/putdata", protect, async (req, res) => {
  try {
    const apiResponse = await apiCall(req.body);
    const match = apiResponse.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = match ? match[1] : apiResponse;
    const parsedData = JSON.parse(jsonString);
    for(let item of parsedData){
      let t = new Transaction({
        userId: req.user.id,
        amount: item.amount,
        date: new Date(item.transactionDate),
        category: item.category
      });
      await t.save();
    }
    res.status(200).json(parsedData);
  } catch (error) {
    console.error("An error occurred:", error.message);
    res.status(500).json({ error: "Failed to process the request." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
