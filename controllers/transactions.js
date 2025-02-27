const Transaction = require("../models/transactionsModel");
const User = require("../models/userModel");
const { v4: uuidv4 } = require("uuid"); // For generating unique transaction IDs

const transactionPost = async (req, res) => {
    try {
        const { senderId, receiverId, amount, type } = req.body;

        console.log(req.body);

        if (!senderId || !amount || !type) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        if (type === "send-money" && amount < 50) {
            return res.status(400).json({ success: false, message: "Minimum send-money amount is 50 Taka" });
        }

        const sender = await User.findById(senderId);
        if (!sender) {
            return res.status(404).json({ success: false, message: "Sender not found" });
        }

        let fee = 0;
        let totalDeduction = amount;
        let receiver = null;
        let agent = null;

        if (type === "send-money") {
            if (!receiverId) {
                return res.status(400).json({ success: false, message: "Receiver ID is required for send-money" });
            }

            receiver = await User.findById(receiverId);
            if (!receiver) {
                return res.status(404).json({ success: false, message: "Receiver not found" });
            }

            if (amount > 100) {
                fee = 5;
                totalDeduction += fee;
            }

            if (sender.amount < totalDeduction) {
                return res.status(400).json({ success: false, message: "Insufficient balance" });
            }

            sender.amount -= totalDeduction;
            receiver.amount += amount;

            const admin = await User.findOne({ role: "admin" });
            if (admin) admin.amount += fee;

            await sender.save();
            await receiver.save();
            if (admin) await admin.save();
        }

        else if (type === "cash-in") {
            sender.amount += amount;
            await sender.save();
        }

        else if (type === "cash-out") {
            fee = (amount * 1.5) / 100;
            const agentFee = (amount * 1) / 100;
            const adminFee = (amount * 0.5) / 100;
            totalDeduction += fee;

            if (sender.amount < totalDeduction) {
                return res.status(400).json({ success: false, message: "Insufficient balance for cash-out" });
            }

            sender.amount -= totalDeduction;

            const admin = await User.findOne({ role: "admin" });
            if (admin) admin.amount += adminFee;

            agent = await User.findById(receiverId);
            if (agent) agent.amount += agentFee;

            await sender.save();
            if (admin) await admin.save();
            if (agent) await agent.save();
        }

        else {
            return res.status(400).json({ success: false, message: "Invalid transaction type" });
        }

        const transaction = new Transaction({
            transactionId: uuidv4(),
            sender: senderId,
            receiver: receiverId || null,
            agent: type === "cash-out" ? receiverId : null,
            amount,
            type,
            fee,
            status: "completed",
        });

        await transaction.save();

        res.status(201).json({
            success: true,
            message: "Transaction successful",
            data: transaction,
        });
    } catch (error) {
        console.error("Transaction error:", error);
        res.status(500).json({
            success: false,
            message: "Transaction failed",
            error: error.message,
        });
    }
};

module.exports = transactionPost;
