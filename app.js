import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiCall from "./utils/apiCall.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

async function connectDB() {
    await mongoose.connect(process.env.DB_URL)
}
connectDB()
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((err) => {
        console.log(err);
    });


// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


// Database connection would go here
app.post("/putdata", async (req, res) => {
  try {
    const apiResponse = await apiCall(req.body);
    const match = apiResponse.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = match ? match[1] : apiResponse;
    const parsedData = JSON.parse(jsonString);
    res.status(200).json(parsedData);
  } catch (error) {
    console.error("An error occurred:", error.message);
    res.status(500).json({ error: "Failed to process the request." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
