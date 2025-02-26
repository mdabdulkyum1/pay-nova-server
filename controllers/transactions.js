const Transaction = require("../models/transactionsModel");
const User = require("../models/userModel"); // Assuming you have a User model

const transactionPost = async (req, res) => {
    try {
        const { senderId, receiverId, amount, type } = req.body;

        console.log(req.body)

        // Validate required fields
        if (!senderId || !amount || !type) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Validate minimum send-money amount
        if (type === "send-money" && amount < 50) {
            return res.status(400).json({ success: false, message: "Minimum send-money amount is 50 Taka" });
        }

        // Fetch sender details
        const sender = await User.findById(senderId);
        if (!sender) {
            return res.status(404).json({ success: false, message: "Sender not found" });
        }

        let fee = 0;
        let totalDeduction = amount;

        // Handle different transaction types
        if (type === "send-money") {
            if (!receiverId) {
                return res.status(400).json({ success: false, message: "Receiver ID is required for send-money" });
            }

            // Fetch receiver details
            const receiver = await User.findById(receiverId);
            if (!receiver) {
                return res.status(404).json({ success: false, message: "Receiver not found" });
            }

            // Apply fee for transactions over 100 Taka
            if (amount > 100) {
                fee = 5;
                totalDeduction += fee;
            }

            // Check sender's balance
            if (sender.amount < totalDeduction) {
                return res.status(400).json({ success: false, message: "Insufficient balance" });
            }

            // Update sender & receiver balances
            sender.amount -= totalDeduction;
            receiver.amount += amount;

            // Add fee to Admin account (assuming Admin has ID "admin")
            const admin = await User.findOne({ role: "admin" });
            if (admin) admin.amount += fee;

            await sender.save();
            await receiver.save();
            if (admin) await admin.save();
        }

        else if (type === "cash-in") {
            // No fee, just increase sender balance
            sender.amount += amount;
            await sender.save();
        }

        else if (type === "cash-out") {
            // Cash-out fee: 1.5% (Admin: 0.5%, Agent: 1%)
            fee = (amount * 1.5) / 100;
            const agentFee = (amount * 1) / 100;
            const adminFee = (amount * 0.5) / 100;
            totalDeduction += fee;

            if (sender.amount < totalDeduction) {
                return res.status(400).json({ success: false, message: "Insufficient balance for cash-out" });
            }

            // Deduct balance from sender
            sender.amount -= totalDeduction;

            // Add income to Admin
            const admin = await User.findOne({ role: "admin" });
            if (admin) admin.amount += adminFee;

            // Add income to Agent (receiver in cash-out is the agent)
            const agent = await User.findById(receiverId);
            if (agent) agent.amount += agentFee;

            await sender.save();
            if (admin) await admin.save();
            if (agent) await agent.save();
        }

        else {
            return res.status(400).json({ success: false, message: "Invalid transaction type" });
        }

        // Create and save the transaction
        const transaction = new Transaction({
            senderId,
            receiverId: receiverId || null,
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
