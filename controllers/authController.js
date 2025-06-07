// const User = require('../models/Users');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// // ====== SIGNUP CONTROLLER ======
// exports.signup = async (req, res) => {
//   try {
//     const { name, username, email, password } = req.body;

//     // Basic validation
//     if (!name || !username || !email || !password) {
//       return res.status(400).json({ message: 'Please fill all required fields' });
//     }

//     // Check if email or username already exists
//     const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Email or Username already exists' });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create user
//     const newUser = new User({
//       name,
//       username,
//       email,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     // Create JWT token
//     // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
//     const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1d' });


//     res.status(201).json({
//       message: 'User registered successfully',
//       user: {
//         id: newUser._id,
//         name: newUser.name,
//         username: newUser.username,
//         email: newUser.email,
//       },
//       token,
//     });
//   } catch (error) {
//     console.error('Signup error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // ====== LOGIN CONTROLLER ======
// // exports.loginUser = async (req, res) => {
// //   try {
// //     const { email, password } = req.body;

// //     // Find user by email
// //     const user = await User.findOne({ email });
// //     if (!user) return res.status(400).json({ message: 'User not found' });

// //     // Check password match
// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

// //     // Generate token
// //     // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
// //     //   expiresIn: '1d',
// //     // });
// //     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
// //         expiresIn: '1d',
// //     });


// //     // Send response
// //     res.status(200).json({
// //       message: 'Login successful',
// //       user: {
// //         id: user._id,
// //         name: user.name,
// //         username: user.username,
// //         email: user.email,
// //       },
// //       token,
// //     });
// //   } catch (err) {
// //     console.error('Login error:', err);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // };

// exports.loginUser = async (req, res) => {
// try {
// const { email, password } = req.body;

// // Find user by email
// const user = await User.findOne({ email });
// if (!user) {
//   return res.status(400).json({ message: 'Invalid credentials' });
// }

// // Check if password matches
// const isMatch = await bcrypt.compare(password, user.password);
// if (!isMatch) {
//   return res.status(400).json({ message: 'Invalid credentials' });
// }

// // Generate JWT token
// const token = jwt.sign(
//   { id: user._id, role: user.role },
//   process.env.JWT_SECRET,
//   { expiresIn: '1d' }
// );

// // Send response
// res.status(200).json({
//   message: 'Login successful',
//   user: {
//     id: user._id,
//     name: user.name,
//     username: user.username,
//     email: user.email,
//   },
//   token,
// });
// } catch (err) {
// console.error('Login error:', err);
// res.status(500).json({ message: 'Server error' });
// }
// };

const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ====== SIGNUP CONTROLLER ======
exports.signup = async (req, res) => {
try {
const { name, username, email, password } = req.body;

// Basic validation
if (!name || !username || !email || !password) {
  return res.status(400).json({ message: 'Please fill all required fields' });
}

// Check if email or username already exists
const existingUser = await User.findOne({ $or: [{ email }, { username }] });
if (existingUser) {
  return res.status(400).json({ message: 'Email or Username already exists' });
}

// Hash password
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
console.log('Hashed password:', hashedPassword); // 🔍 Debugging output

// Create user
const newUser = new User({
  name,
  username,
  email,
  password: hashedPassword,
});

await newUser.save();

// Create JWT token
const token = jwt.sign(
  { id: newUser._id, role: newUser.role },
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);

res.status(201).json({
  message: 'User registered successfully',
  user: {
    id: newUser._id,
    name: newUser.name,
    username: newUser.username,
    email: newUser.email,
  },
  token,
});
} catch (error) {
console.error('Signup error:', error);
res.status(500).json({ message: 'Server error' });
}
};

// ====== LOGIN CONTROLLER ======
exports.loginUser = async (req, res) => {
try {
const { email, password } = req.body;

// Find user by email
const user = await User.findOne({ email });
if (!user) {
  return res.status(400).json({ message: 'Invalid credentials' });
}

console.log('Entered password:', password); // 🔍 Debugging output
console.log('Stored password:', user.password); // 🔍 Debugging output


// Check if password matches
const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
  return res.status(400).json({ message: 'Invalid credentials' });
}

// Generate JWT token
const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);

res.status(200).json({
  message: 'Login successful',
  user: {
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
  },
  token,
});
} catch (err) {
console.error('Login error:', err);
res.status(500).json({ message: 'Server error' });
}
};