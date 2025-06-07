const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // receiver
  type: { type: String, enum: ['like', 'comment', 'follow', 'mention'], required: true },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // sender
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
