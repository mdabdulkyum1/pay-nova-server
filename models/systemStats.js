const mongoose = require('mongoose');

const systemStatsSchema = new mongoose.Schema({
  totalUsers: { type: Number, default: 0 },
  totalAgents: { type: Number, default: 0 },
  totalTransactions: { type: Number, default: 0 },
  totalMoneyInSystem: { type: Number, default: 0 }
}, { timestamps: true, versionKey: false });

const SystemStats = mongoose.model('SystemStats', systemStatsSchema);

module.exports = SystemStats;
