const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pin: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'user' },
  nid: { type: String, required: true },
  photoURL: { type: String, default: null },
  session: { type: String, default: null },
  amount: { type: Number, default: 0 }
}, { timestamps: true, versionKey: false }); 


const User = mongoose.model('User', userSchema);

module.exports = User;
