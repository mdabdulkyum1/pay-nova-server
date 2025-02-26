const mongoose = require('mongoose');

const balanceRechargeSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Agent requesting balance
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' } // Approval status
}, { timestamps: true, versionKey: false });

const BalanceRecharge = mongoose.model('BalanceRecharge', balanceRechargeSchema);

module.exports = BalanceRecharge;
