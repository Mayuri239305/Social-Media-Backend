// const express = require('express');
// const router = express.Router();
// const protect = require('../middlewares/authMiddleware');
// const Notification = require('../models/Notification');

// router.get('/', protect, async (req, res) => {
//   const notifications = await Notification.find({ user: req.user.id })
//     .populate('fromUser', 'username')
//     .populate('post', 'text')
//     .sort({ createdAt: -1 });

//   res.json(notifications);
// });

// router.put('/read', protect, async (req, res) => {
//   await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
//   res.json({ message: 'All notifications marked as read' });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const Notification = require('../models/Notification');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Manage user notifications
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all notifications for the logged-in user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   type:
 *                     type: string
 *                     description: Type of notification (like, comment, etc.)
 *                   fromUser:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       username:
 *                         type: string
 *                   post:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       text:
 *                         type: string
 *                   read:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id })
    .populate('fromUser', 'username')
    .populate('post', 'text')
    .sort({ createdAt: -1 });

  res.json(notifications);
});

/**
 * @swagger
 * /notifications/read:
 *   put:
 *     summary: Mark all unread notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All notifications marked as read
 *       401:
 *         description: Unauthorized
 */
router.put('/read', protect, async (req, res) => {
  await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
  res.json({ message: 'All notifications marked as read' });
});

module.exports = router;
