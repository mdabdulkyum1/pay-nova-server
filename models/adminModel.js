const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pin: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['super-admin', 'admin'], default: 'admin' }, 
  session: { type: String, default: null }, 
  totalIncome: { type: Number, default: 0 },
  systemBalance: { type: Number, default: 0 } 
}, { timestamps: true, versionKey: false });

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
