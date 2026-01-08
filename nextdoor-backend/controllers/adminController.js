// controllers/adminController.js
const { Op, literal } = require('sequelize')
const {
  sequelize,
  Course,
  Enrollment,
  Order,
  User,
} = require('../models')

/**
 * GET /api/admin/stats
 * Summary stats for admin dashboard.
 */
const getAdminStats = async (req, res, next) => {
  try {
    const [totalRevenue30d, activeStudents, ordersToday, publishedCourses] =
      await Promise.all([
        // Sum of completed payments in last 30 days
        Order.sum('totalAmount', {
          where: {
            paymentStatus: 'completed', // uses Order.paymentStatus enum
            createdAt: {
              [Op.gte]: literal("NOW() - INTERVAL '30 days'"),
            },
          },
        }),

        // Distinct students with at least one active enrollment
        Enrollment.count({
          distinct: true,
          col: 'userId',
          where: { status: 'active' },
        }),

        // Orders created today (any status)
        Order.count({
          where: {
            createdAt: {
              [Op.gte]: literal("DATE_TRUNC('day', NOW())"),
            },
          },
        }),

        // Published courses only
        Course.count({
          where: { isPublished: true },
        }),
      ])

    res.status(200).json({
      totalRevenue: Number(totalRevenue30d) || 0,
      activeStudents,
      ordersToday,
      courses: publishedCourses,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/admin/orders?limit=5
 * Recent orders list for dashboard table.
 */
const getRecentOrders = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit || '5', 10)

    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: 'user', // requires Order.belongsTo(User, { as: 'user' }) and User.hasMany(Order, { as: 'orders' })
          attributes: ['firstName', 'lastName', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
    })

    const result = orders.map((o) => ({
      id: o.id,
      customer: o.user
        ? (`${o.user.firstName || ''} ${o.user.lastName || ''}`.trim() || o.user.email)
        : 'Guest',
      total: Number(o.totalAmount) || 0,
      status: o.status,
      createdAt: o.createdAt,
    }))

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/admin/top-courses?limit=5
 * Top published courses by enrollmentCount.
 */
const getTopCourses = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit || '5', 10)

    const courses = await Course.findAll({
      where: { isPublished: true },
      order: [['enrollmentCount', 'DESC']],
      limit,
      attributes: ['id', 'title', 'price', 'enrollmentCount'],
    })

    const result = courses.map((c) => ({
      id: c.id,
      title: c.title,
      price: Number(c.price) || 0,
      enrollments: c.enrollmentCount || 0,
    }))

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAdminStats,
  getRecentOrders,
  getTopCourses,
}
