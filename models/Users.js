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

// const bcrypt = require('bcryptjs');

// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

// userSchema.index({ username: 1 });


module.exports = mongoose.model('User', userSchema);

