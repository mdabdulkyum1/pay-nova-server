const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true }, // Unique transaction ID
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Sender ID
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Receiver ID (if applicable)
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Agent ID (if applicable)
  amount: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ['send-money', 'cash-in', 'cash-out'], 
    required: true 
  },
  fee: { type: Number, default: 0 }, // Fee charged for transaction
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' } // Transaction status
}, { timestamps: true, versionKey: false });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
