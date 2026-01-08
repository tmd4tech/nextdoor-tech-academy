// server/routes/courseRoutes.js
const express = require('express');
const router = express.Router();

const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { validateCourse, handleValidationErrors } = require('../middleware/validation');

// PUBLIC LIST
router.get('/', courseController.getAllCourses);

// ADMIN LIST MUST COME BEFORE :courseId
router.get(
  '/admin',
  authMiddleware,
  roleMiddleware('instructor', 'admin'),
  courseController.getAllCoursesAdmin
);

// PUBLIC DETAIL
router.get('/:courseId', courseController.getCourseById);

// ENROLLMENT
router.post('/:courseId/enroll', authMiddleware, courseController.enrollInCourse);
router.get('/enrolled', authMiddleware, courseController.getEnrollments);
router.get('/enrollment/:enrollmentId/progress', authMiddleware, courseController.getEnrollmentProgress);

// ADMIN CRUD
router.post(
  '/admin',
  authMiddleware,
  roleMiddleware('instructor', 'admin'),
  validateCourse,
  handleValidationErrors,
  courseController.createCourse
);

router.put(
  '/admin/:courseId',
  authMiddleware,
  roleMiddleware('instructor', 'admin'),
  courseController.updateCourse
);

router.delete(
  '/admin/:courseId',
  authMiddleware,
  roleMiddleware('instructor', 'admin'),
  courseController.deleteCourse
);

module.exports = router;
