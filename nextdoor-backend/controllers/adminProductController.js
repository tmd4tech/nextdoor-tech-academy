// controllers/adminProductController.js
const Product = require('../models/Product')

const normalizeCategory = raw => {
  if (!raw) return null
  const v = String(raw).toLowerCase().trim()
  if (v === 'phone' || v.startsWith('phone')) return 'phones'
  if (v === 'laptop' || v.startsWith('laptop')) return 'laptops'
  if (v.startsWith('access')) return 'accessories'
  if (v.includes('repair')) return 'repair_tools'
  if (v === 'part' || v.includes('part')) return 'parts'
  return v
}

// LIST all products for admin
exports.listProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({ order: [['createdAt', 'DESC']] })
    res.json(products)
  } catch (err) {
    next(err)
  }
}

// GET single product
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    next(err)
  }
}

// CREATE product from admin form
exports.createProduct = async (req, res, next) => {
  try {
    console.log('ADMIN CREATE BODY:', req.body)
    console.log('ADMIN CREATE active raw =', req.body.active)

    let {
      name,
      sku,
      price,
      stock,
      brand,
      category,
      shortDescription,
      description,
      specs,
      active,
    } = req.body

    category = normalizeCategory(category)

    const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : null

    const product = await Product.create({
      name,
      sku,
      price,
      stock,
      brand,
      category,
      description: description || shortDescription || '',
      isActive: active === 'true',
      image: imageUrl,
      images: [],
    })

    console.log('ADMIN CREATE saving isActive =', product.isActive)

    res.status(201).json(product)
  } catch (err) {
    next(err)
  }
}

// UPDATE product from admin form
exports.updateProduct = async (req, res, next) => {
  try {
    console.log('ADMIN UPDATE BODY:', req.body)
    console.log('ADMIN UPDATE active raw =', req.body.active)

    const product = await Product.findByPk(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    let {
      name,
      sku,
      price,
      stock,
      brand,
      category,
      shortDescription,
      description,
      specs,
      active,
    } = req.body

    category = normalizeCategory(category)

    if (req.file) {
      product.image = `/uploads/products/${req.file.filename}`
    }

    const isActive = active === 'true'

    Object.assign(product, {
      name,
      sku,
      price,
      stock,
      brand,
      category,
      description: description || shortDescription || product.description,
      isActive,
    })

    // force Sequelize to send isActive in UPDATE
    product.changed('isActive', true)

    console.log('ADMIN UPDATE saving isActive =', product.isActive)

    await product.save()
    res.json(product)
  } catch (err) {
    next(err)
  }
}
