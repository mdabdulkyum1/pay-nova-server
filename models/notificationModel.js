const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Receiver of the notification
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true, versionKey: false });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
