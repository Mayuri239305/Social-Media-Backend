// const express = require('express');
// const router = express.Router();
// const protect = require('../middlewares/authMiddleware');
// const User = require('../models/Users');
// const { body, validationResult } = require('express-validator');
// // const { redisClient } = require('../app'); 
// const canViewProfile = require('../utils/privacyCheck'); // ✅ Import at top
// const redisClient = require('../utils/redisClient');


// router.post('/register', [
//   body('email').isEmail().withMessage('Enter valid email'),
//   body('password').isLength({ min: 6 }).withMessage('Password too short')
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

//   // your register logic here
// });

// // ✅ Update User Profile
// router.put('/update', protect, async (req, res) => {
//   try {
//     const { name, username, email, profilePicture } = req.body;

//     const updatedUser = await User.findByIdAndUpdate(
//       req.user.id,
//       { name, username, email, profilePicture },
//       { new: true, runValidators: true }
//     );

//     res.json({
//       message: 'Profile updated successfully',
//       user: {
//         id: updatedUser._id,
//         name: updatedUser.name,
//         username: updatedUser.username,
//         email: updatedUser.email,
//         profilePicture: updatedUser.profilePicture,
//       },
//     });
//   } catch (err) {
//     console.error('Profile update error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // 🔍 Search Users
// router.get('/search', protect, async (req, res) => {
//   try {
//     const keyword = req.query.q;

//     const users = await User.find({
//       $or: [
//         { name: { $regex: keyword, $options: 'i' } },
//         { username: { $regex: keyword, $options: 'i' } }
//       ]
//     }).select('-password');

//     res.json(users);
//   } catch (err) {
//     console.error('Search error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;

// // ✅ Follow/unfollow user
// router.put('/follow/:id', protect, async (req, res) => {
//   try {
//     const userToFollow = await User.findById(req.params.id);
//     const currentUser = await User.findById(req.user.id);

//     if (!userToFollow || !currentUser) return res.status(404).json({ message: 'User not found' });

//     if (currentUser.following.includes(userToFollow._id)) {
//       currentUser.following.pull(userToFollow._id);
//       userToFollow.followers.pull(currentUser._id);
//       await currentUser.save();
//       await userToFollow.save();
//       return res.json({ message: 'Unfollowed successfully' });
//     } else {
//       currentUser.following.push(userToFollow._id);
//       userToFollow.followers.push(currentUser._id);
//       await currentUser.save();
//       await userToFollow.save();

//       if (userToFollow._id.toString() !== req.user.id) {
//         await Notification.create({
//           user: userToFollow._id,
//           type: 'follow',
//           fromUser: currentUser._id
//         });
//       }

//       return res.json({ message: 'Followed successfully' });
//     }
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // // ✅ Get list of followers and following
// // router.get('/follow-data', protect, async (req, res) => {
// //   try {
// //     const user = await User.findById(req.user.id)
// //       .populate('following', 'username name')
// //       .populate('followers', 'username name');

// //     res.json({
// //       following: user.following,
// //       followers: user.followers
// //     });
// //   } catch (err) {
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });

// // ✅ Get list of followers and following
// router.get('/follow-data', protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id)
//       .populate('following', 'username name email')   // 🔄 include email
//       .populate('followers', 'username name email');  // 🔄 include email

//     res.json({
//       following: user.following,
//       followers: user.followers
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // // ✅ Cached User Profile Route
// // router.get('/profile/:id', protect, async (req, res) => {
// //   try {
// //     const cachedUser = await redisClient.get(`user:${req.params.id}`);
// //     if (cachedUser) {
// //       return res.json(JSON.parse(cachedUser));
// //     }

// //     const user = await User.findById(req.params.id).select('-password');
// //     if (!user) return res.status(404).json({ message: 'User not found' });

// //     await redisClient.set(`user:${req.params.id}`, JSON.stringify(user), { EX: 3600 }); // Cache for 1 hour
// //     res.json(user);
// //   } catch (err) {
// //     console.error('Error fetching user profile:', err);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });

// router.get('/profile/:id', protect, async (req, res) => {
//   try {
//     const cachedUser = await redisClient.get(`user:${req.params.id}`);
//     let user;

//     if (cachedUser) {
//       user = JSON.parse(cachedUser);
//     } else {
//       user = await User.findById(req.params.id)
//         .select('-password')
//         .populate('followers', '_id'); // Needed for privacy check

//       if (!user) return res.status(404).json({ message: 'User not found' });

//       await redisClient.set(`user:${req.params.id}`, JSON.stringify(user), { EX: 3600 }); // Cache for 1 hour
//     }

//     // ✅ Privacy check
//     if (!canViewProfile(req.user, user)) {
//       return res.status(403).json({ message: 'You do not have permission to view this profile.' });
//     }

//     res.json(user);
//   } catch (err) {
//     console.error('Error fetching user profile:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and social features
 */

const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const adminOnly = require('../middlewares/adminMiddleware');
const User = require('../models/Users');
const { body, validationResult } = require('express-validator');
const canViewProfile = require('../utils/privacyCheck');
// const redisClient = require('../utils/redisClient');

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post('/register', [
  body('email').isEmail().withMessage('Enter valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password too short')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  // your register logic here
});

/**
 * @swagger
 * /users/update:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
// router.put('/update', protect, async (req, res) => {
//   try {
//     const { name, username, email, profilePicture } = req.body;
//     const updatedUser = await User.findByIdAndUpdate(
//       req.user.id,
//       { name, username, email, profilePicture },
//       { new: true, runValidators: true }
//     );
//     res.json({
//       message: 'Profile updated successfully',
//       user: updatedUser
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });
router.put('/update', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update simple fields
    const { name, username, email, profilePicture } = req.body;
    if (name !== undefined) user.name = name;
    if (username !== undefined) user.username = username;
    if (email !== undefined) user.email = email;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    // ✅ Update nested privacy fields safely
    if (req.body.privacy) {
      user.privacy = {
        ...user.privacy.toObject?.() || user.privacy, // for mongoose subdoc
        ...req.body.privacy,
      };
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search users by keyword
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: List of matching users
 */
router.get('/search', protect, async (req, res) => {
  try {
    const keyword = req.query.q;
    const users = await User.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { username: { $regex: keyword, $options: 'i' } }
      ]
    }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /users/follow/{id}:
 *   put:
 *     summary: Follow or unfollow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Followed or unfollowed user
 */
router.put('/follow/:id', protect, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow || !currentUser) return res.status(404).json({ message: 'User not found' });

    if (currentUser.following.includes(userToFollow._id)) {
      currentUser.following.pull(userToFollow._id);
      userToFollow.followers.pull(currentUser._id);
      await currentUser.save();
      await userToFollow.save();
      return res.json({ message: 'Unfollowed successfully' });
    } else {
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);
      await currentUser.save();
      await userToFollow.save();
      return res.json({ message: 'Followed successfully' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /users/follow-data:
 *   get:
 *     summary: Get list of followers and following
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of followers and following
 */
router.get('/follow-data', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('following', 'username name email')
      .populate('followers', 'username name email');
    res.json({
      following: user.following,
      followers: user.followers
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /users/profile/{id}:
 *   get:
 *     summary: Get user profile by ID (with privacy check and cache)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile data
 *       403:
 *         description: Forbidden - cannot view profile
 *       404:
 *         description: User not found
 */
// ✅ Get User Profile without Redis cache
router.get('/profile/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', '_id'); // Required for privacy check

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Apply privacy check before returning data
    if (!canViewProfile(req.user, user)) {
      return res.status(403).json({ message: 'You do not have permission to view this profile.' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// router.get('/profile/:id', protect, async (req, res) => {
//   try {
//     const cachedUser = await redisClient.get(`user:${req.params.id}`);
//     let user;

//     if (cachedUser) {
//       user = JSON.parse(cachedUser);
//     } else {
//       user = await User.findById(req.params.id)
//         .select('-password')
//         .populate('followers', '_id');

//       if (!user) return res.status(404).json({ message: 'User not found' });
//       await redisClient.set(`user:${req.params.id}`, JSON.stringify(user), { EX: 3600 });
//     }

//     if (!canViewProfile(req.user, user)) {
//       return res.status(403).json({ message: 'You do not have permission to view this profile.' });
//     }

//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

module.exports = router;
