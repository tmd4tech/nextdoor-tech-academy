const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { validateCourse, handleValidationErrors } = require('../middleware/validation');

// Public routes
router.get('/', courseController.getAllCourses);
router.get('/:courseId', courseController.getCourseById);

// Protected routes - student enrollment
router.post('/:courseId/enroll', authMiddleware, courseController.enrollInCourse);
router.get('/enrolled', authMiddleware, courseController.getEnrollments);
router.get('/enrollment/:enrollmentId/progress', authMiddleware, courseController.getEnrollmentProgress);

// Protected routes - instructor
router.post('/', authMiddleware, roleMiddleware('instructor', 'admin'), validateCourse, handleValidationErrors, courseController.createCourse);
router.put('/:courseId', authMiddleware, roleMiddleware('instructor', 'admin'), courseController.updateCourse);
router.delete('/:courseId', authMiddleware, roleMiddleware('instructor', 'admin'), courseController.deleteCourse);

module.exports = router;
