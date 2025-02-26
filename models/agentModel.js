const mongoose = require('mongoose');

const agentRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to user
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }, // Approval status
}, { timestamps: true, versionKey: false });

const AgentRequest = mongoose.model('AgentRequest', agentRequestSchema);

module.exports = AgentRequest;
