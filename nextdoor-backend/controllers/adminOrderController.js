// controllers/adminOrderController.js
const Order = require('../models/Order')

exports.listOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']],
    })

    res.json(orders)
  } catch (err) {
    next(err)
  }
}

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const order = await Order.findByPk(id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    order.status = status
    await order.save()

    res.json(order)
  } catch (err) {
    next(err)
  }
}
