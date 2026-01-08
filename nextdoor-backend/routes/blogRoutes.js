const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { validateBlog, handleValidationErrors } = require('../middleware/validation');

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/featured', blogController.getFeaturedBlogs);
router.get('/search', blogController.searchBlogs);
router.get('/slug/:slug', blogController.getBlogBySlug);
router.get('/:blogId', blogController.getBlogById);

// Protected routes - create and edit
router.post('/', authMiddleware, roleMiddleware('admin', 'instructor'), validateBlog, handleValidationErrors, blogController.createBlog);
router.put('/:blogId', authMiddleware, roleMiddleware('admin', 'instructor'), blogController.updateBlog);
router.delete('/:blogId', authMiddleware, roleMiddleware('admin', 'instructor'), blogController.deleteBlog);

module.exports = router;
