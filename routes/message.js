// const express = require('express');
// const router = express.Router();
// const protect = require('../middlewares/authMiddleware');
// const Message = require('../models/Message');

// // ✅ Send a message
// router.post('/', protect, async (req, res) => {
//   const { receiver, text } = req.body;

//   const message = new Message({
//     sender: req.user.id,
//     receiver,
//     text
//   });

//   await message.save();
//   res.status(201).json({ message: 'Message sent', data: message });
// });

// // ✅ Get conversation
// router.get('/:userId', protect, async (req, res) => {
//   const messages = await Message.find({
//     $or: [
//       { sender: req.user.id, receiver: req.params.userId },
//       { sender: req.params.userId, receiver: req.user.id }
//     ]
//   }).sort({ createdAt: 1 });

//   res.json(messages);
// });

// // ✅ Mark as read
// router.put('/read/:userId', protect, async (req, res) => {
//   await Message.updateMany({ sender: req.params.userId, receiver: req.user.id }, { read: true });
//   res.json({ message: 'Messages marked as read' });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const Message = require('../models/Message');

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Messaging operations between users
 */

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Send a message to another user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiver
 *               - text
 *             properties:
 *               receiver:
 *                 type: string
 *                 description: ID of the user receiving the message
 *               text:
 *                 type: string
 *                 description: Message text content
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', protect, async (req, res) => {
  const { receiver, text } = req.body;

  const message = new Message({
    sender: req.user.id,
    receiver,
    text
  });

  await message.save();
  res.status(201).json({ message: 'Message sent', data: message });
});

/**
 * @swagger
 * /messages/{userId}:
 *   get:
 *     summary: Get all messages between the authenticated user and another user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the other user in the conversation
 *     responses:
 *       200:
 *         description: List of messages
 *       401:
 *         description: Unauthorized
 */
router.get('/:userId', protect, async (req, res) => {
  const messages = await Message.find({
    $or: [
      { sender: req.user.id, receiver: req.params.userId },
      { sender: req.params.userId, receiver: req.user.id }
    ]
  }).sort({ createdAt: 1 });

  res.json(messages);
});

/**
 * @swagger
 * /messages/read/{userId}:
 *   put:
 *     summary: Mark all messages from a specific user as read
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose messages should be marked as read
 *     responses:
 *       200:
 *         description: Messages marked as read
 *       401:
 *         description: Unauthorized
 */
router.put('/read/:userId', protect, async (req, res) => {
  await Message.updateMany(
    { sender: req.params.userId, receiver: req.user.id },
    { read: true }
  );
  res.json({ message: 'Messages marked as read' });
});

module.exports = router;

