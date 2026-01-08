// controllers/shopProductController.js
const Product = require('../models/Product')

// GET /api/products  (shop-facing)
exports.listShopProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: { isActive: true },          // only active products
      order: [['createdAt', 'DESC']],
    })
    res.json(products)
  } catch (err) {
    next(err)
  }
}
