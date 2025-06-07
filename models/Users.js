const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: '' },
  bio: { type: String, default: '' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  role: { type: String, enum: ['user', 'admin'], default: 'user' },

   // 🔐 Privacy settings added here
  privacy: {
    posts: { type: String, enum: ['public', 'followers', 'private'], default: 'public' },
    profile: { type: String, enum: ['public', 'followers', 'private'], default: 'public' }
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

