const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const adminOnly = require('../middlewares/adminMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User-related routes
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get the logged-in user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   description: Authenticated user object
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', protect, (req, res) => {
  res.json({ message: 'This is your profile', user: req.user });
});

/**
 * @swagger
 * /users/admin/deleteUser/{id}:
 *   delete:
 *     summary: Delete a user by ID (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to delete
 *     responses:
 *       200:
 *         description: User deleted by admin
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not an admin)
 */
router.delete('/admin/deleteUser/:id', protect, adminOnly, (req, res) => {
  res.json({ message: `Admin deleted user with ID ${req.params.id}` });
});

module.exports = router;
