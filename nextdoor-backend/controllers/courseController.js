// controllers/courseController.js
const {
  Course,
  Enrollment,
  Lesson,
  LessonProgress,
  User,
  Payment,
} = require('../models');
const emailService = require('../services/emailService');
const paymentService = require('../services/paymentService');
const { Op } = require('sequelize');

/**
 * Public: list courses with filters + pagination
 * GET /api/courses
 */
const getAllCourses = async (req, res, next) => {
  try {
    const { category, level, search, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    const where = { isPublished: true };
    if (category) where.category = category;
    if (level) where.level = level;
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Course.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      courses: rows,
      pagination: {
        total: count,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: list all courses without pagination wrapper
 * GET /api/courses/admin
 */
const getAllCoursesAdmin = async (req, res, next) => {
  try {
    const courses = await Course.findAll({
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findByPk(courseId, {
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'firstName', 'lastName', 'bio'],
        },
        {
          model: Lesson,
          as: 'lessons',
          where: { isPublished: true },
          required: false,
        },
      ],
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const {
      title,
      description,
      syllabus,
      price,
      category,
      level,
      duration,
      image,
    } = req.body;
    const instructorId = req.user.id;

    const course = await Course.create({
      title,
      description,
      syllabus,
      price,
      instructorId,
      category,
      level,
      duration,
      image,
      isPublished: false,
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully.',
      course,
    });
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const {
      title,
      description,
      syllabus,
      price,
      category,
      level,
      duration,
      image,
      isPublished,
    } = req.body;

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    if (title !== undefined) course.title = title;
    if (description !== undefined) course.description = description;
    if (syllabus !== undefined) course.syllabus = syllabus;
    if (price !== undefined) course.price = price;
    if (category !== undefined) course.category = category;
    if (level !== undefined) course.level = level;
    if (duration !== undefined) course.duration = duration;
    if (image !== undefined) course.image = image;
    if (isPublished !== undefined) course.isPublished = isPublished;

    await course.save();

    res.status(200).json({
      success: true,
      message: 'Course updated successfully.',
      course,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    await course.destroy();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

const enrollInCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      where: { courseId, userId },
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course.',
      });
    }

    if (parseFloat(course.price) > 0) {
      const paymentResult = await paymentService.createPaymentIntent(
        course.price,
        'usd',
        {
          courseId,
          userId,
          type: 'course_enrollment',
        }
      );

      if (!paymentResult.success) {
        return res.status(400).json({
          success: false,
          message: 'Payment initialization failed.',
        });
      }

      await Payment.create({
        userId,
        amount: course.price,
        status: 'pending',
        paymentType: 'course',
        stripePaymentIntentId: paymentResult.paymentIntentId,
        metadata: { courseId },
      });

      return res.status(200).json({
        success: true,
        message: 'Payment required. Initialize payment to complete enrollment.',
        clientSecret: paymentResult.clientSecret,
        paymentIntentId: paymentResult.paymentIntentId,
      });
    }

    const enrollment = await Enrollment.create({
      courseId,
      userId,
      status: 'active',
    });

    course.enrollmentCount += 1;
    await course.save();

    const user = await User.findByPk(userId);
    await emailService.sendEnrollmentConfirmationEmail(user.email, {
      courseName: course.title,
      amount: course.price,
    });

    res.status(201).json({
      success: true,
      message: 'Enrolled in course successfully.',
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

const getEnrollments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const where = { userId };
    if (status) where.status = status;

    const enrollments = await Enrollment.findAll({
      where,
      include: [{ model: Course, as: 'course' }],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      enrollments,
    });
  } catch (error) {
    next(error);
  }
};

const getEnrollmentProgress = async (req, res, next) => {
  try {
    const { enrollmentId } = req.params;
    const userId = req.user.id;

    const enrollment = await Enrollment.findOne({
      where: { id: enrollmentId, userId },
      include: [{ model: Course, as: 'course' }],
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found.',
      });
    }

    const lessons = await Lesson.findAll({
      where: { courseId: enrollment.courseId },
      attributes: ['id', 'title', 'order'],
    });

    const progress = await LessonProgress.findAll({
      where: { enrollmentId },
    });

    const progressMap = {};
    progress.forEach((p) => {
      progressMap[p.lessonId] = p.status;
    });

    res.status(200).json({
      success: true,
      enrollment: {
        id: enrollment.id,
        course: enrollment.course,
        progress: enrollment.progress,
        status: enrollment.status,
        lessons: lessons.map((lesson) => ({
          ...lesson.toJSON(),
          status: progressMap[lesson.id] || 'not_started',
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCourses,
  getAllCoursesAdmin,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getEnrollments,
  getEnrollmentProgress,
};
