const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Endpoints related to user posts
 */

/**
 * @swagger
 * /posts/create:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *               media:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 *       500:
 *         description: Server error
 */
router.post('/create', protect, async (req, res) => {
  try {
    const { text, media } = req.body;
    const hashtags = text.match(/#\w+/g) || [];

    const post = new Post({
      user: req.user.id,
      text,
      media,
      hashtags: hashtags.map(tag => tag.toLowerCase())
    });

    await post.save();
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /posts/bookmark/{id}:
 *   put:
 *     summary: Bookmark or unbookmark a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Post ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bookmark toggled
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.put('/bookmark/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.user.id;

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.bookmarks.includes(userId)) {
      post.bookmarks.pull(userId);
      await post.save();
      return res.json({ message: 'Post removed from bookmarks' });
    } else {
      post.bookmarks.push(userId);
      await post.save();
      return res.json({ message: 'Post bookmarked successfully' });
    }
  } catch (err) {
    console.error('Bookmark error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /posts/hashtag/{tag}:
 *   get:
 *     summary: Filter posts by hashtag
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tag
 *         required: true
 *         description: Hashtag to filter by
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of posts with given hashtag
 *       500:
 *         description: Server error
 */
router.get('/hashtag/:tag', protect, async (req, res) => {
  try {
    const tag = req.params.tag.toLowerCase();
    const posts = await Post.find({ hashtags: tag }).populate('user', 'username name');
    res.json(posts);
  } catch (err) {
    console.error('Hashtag filter error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /posts/public:
 *   get:
 *     summary: Get paginated list of public posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       200:
 *         description: Paginated public posts
 *       500:
 *         description: Server error
 */
router.get('/public', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ visibility: 'public' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username name');

    res.json({
      page,
      limit,
      results: posts.length,
      posts
    });
  } catch (err) {
    console.error('Pagination error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /posts/like/{id}:
 *   put:
 *     summary: Like or unlike a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Post ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post liked/unliked
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.put('/like/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.user.id;

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
      await post.save();
      return res.json({ message: 'Post unliked' });
    } else {
      post.likes.push(userId);
      await post.save();

      if (post.user.toString() !== userId) {
        await Notification.create({
          user: post.user,
          type: 'like',
          fromUser: userId,
          post: post._id
        });
      }

      return res.json({ message: 'Post liked' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @swagger
 * /posts/comment/{id}:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Post ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.post('/comment/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const { text } = req.body;

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = {
      user: req.user.id,
      text
    };

    post.comments.push(comment);
    await post.save();

    if (post.user.toString() !== req.user.id) {
      await Notification.create({
        user: post.user,
        type: 'comment',
        fromUser: req.user.id,
        post: post._id
      });
    }

    res.status(201).json({ message: 'Comment added', comment });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
