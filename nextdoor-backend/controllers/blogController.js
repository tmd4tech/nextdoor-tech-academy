const Blog = require('../models/Blog');
const User = require('../models/User');
const { Op } = require('sequelize');

const getAllBlogs = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = { isPublished: true };
    if (category) where.category = category;
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } },
        { tags: { [Op.overlap]: [search] } },
      ];
    }

    const { count, rows } = await Blog.findAndCountAll({
      where,
      include: [{ model: User, as: 'author', attributes: ['id', 'firstName', 'lastName', 'profileImage'] }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['publishedAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      blogs: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({
      where: { slug, isPublished: true },
      include: [{ model: User, as: 'author', attributes: ['id', 'firstName', 'lastName', 'profileImage', 'bio'] }],
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found.',
      });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(error);
  }
};

const getBlogById = async (req, res, next) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findByPk(blogId, {
      include: [{ model: User, as: 'author', attributes: ['id', 'firstName', 'lastName', 'profileImage'] }],
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found.',
      });
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    next(error);
  }
};

const createBlog = async (req, res, next) => {
  try {
    const { title, content, excerpt, category, tags, image } = req.body;
    const authorId = req.user.id;

    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const blog = await Blog.create({
      title,
      slug,
      content,
      excerpt,
      authorId,
      category,
      tags: tags || [],
      image,
      isPublished: false,
    });

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully.',
      blog,
    });
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const { title, content, excerpt, category, tags, image, isPublished } = req.body;

    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found.',
      });
    }

    if (title) {
      blog.title = title;
      blog.slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }
    if (content) blog.content = content;
    if (excerpt) blog.excerpt = excerpt;
    if (category) blog.category = category;
    if (tags) blog.tags = tags;
    if (image) blog.image = image;
    if (isPublished !== undefined) {
      blog.isPublished = isPublished;
      if (isPublished && !blog.publishedAt) {
        blog.publishedAt = new Date();
      }
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Blog post updated successfully.',
      blog,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found.',
      });
    }

    await blog.destroy();

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

const searchBlogs = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters.',
      });
    }

    const blogs = await Blog.findAll({
      where: {
        isPublished: true,
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { content: { [Op.iLike]: `%${query}%` } },
          { tags: { [Op.overlap]: [query] } },
        ],
      },
      include: [{ model: User, as: 'author', attributes: ['id', 'firstName', 'lastName'] }],
      limit: 20,
    });

    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    next(error);
  }
};

const getFeaturedBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.findAll({
      where: { isPublished: true },
      include: [{ model: User, as: 'author', attributes: ['id', 'firstName', 'lastName'] }],
      order: [['views', 'DESC']],
      limit: 5,
    });

    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBlogs,
  getBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  searchBlogs,
  getFeaturedBlogs,
};
