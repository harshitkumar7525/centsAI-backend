import express from "express";

const router = express.Router();

router.post("/:userId", (req, res) => {
    // Handle creating a new transaction for a user
    res.send("Create transaction");
});

router.get("/:userId", (req, res) => {
    // Handle fetching all transactions for a user
    res.send("Get transactions");
});

router.delete("/:userId/:transactionId", (req, res) => {
    // Handle deleting a specific transaction for a user
    res.send("Delete transaction");
});

export default router;
