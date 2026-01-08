const Product = require('../models/Product')
const { Op } = require('sequelize')

const getAllProducts = async (req, res, next) => {
  try {
    const { category, brand, minPrice, maxPrice, search, page = 1, limit = 12 } = req.query
    const offset = (page - 1) * limit

    const where = { isActive: true }

    if (category) where.category = category
    if (brand) where.brand = brand
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price[Op.gte] = minPrice
      if (maxPrice) where.price[Op.lte] = maxPrice
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ]
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    })

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully.',
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    })
  } catch (error) {
    next(error)
  }
}

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params

    const product = await Product.findByPk(id)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      })
    }

    res.status(200).json({
      success: true,
      product,
    })
  } catch (error) {
    next(error)
  }
}

const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      costPrice,
      category,
      brand,
      sku,
      stock,
      image,
      isActive,
      active,
    } = req.body

    const product = await Product.create({
      name,
      description,
      price,
      costPrice,
      category,
      brand,
      sku,
      stock,
      image,
      // accept either isActive (boolean) or active ('true'/'false'), default true
      isActive:
        active !== undefined
          ? active === 'true'
          : isActive !== undefined
          ? !!isActive
          : true,
    })

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product,
    })
  } catch (error) {
    next(error)
  }
}

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    let {
      name,
      description,
      price,
      costPrice,
      category,
      brand,
      sku,
      stock,
      image,
      isActive,
      active, // admin form sends this as 'true'/'false'
    } = req.body

    const product = await Product.findByPk(id)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      })
    }

    if (name) product.name = name
    if (description) product.description = description
    if (price) product.price = price
    if (costPrice) product.costPrice = costPrice
    if (category) product.category = category
    if (brand) product.brand = brand
    if (sku) product.sku = sku
    if (stock !== undefined) product.stock = stock
    if (image) product.image = image

    // key fix: map active/isActive to product.isActive
    if (active !== undefined) {
      product.isActive = active === 'true'
    } else if (isActive !== undefined) {
      product.isActive = !!isActive
    }

    await product.save()

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      product,
    })
  } catch (error) {
    next(error)
  }
}

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params

    const product = await Product.findByPk(id)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      })
    }

    await product.destroy()

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
    })
  } catch (error) {
    next(error)
  }
}

const getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params
    const { limit = 12 } = req.query

    const products = await Product.findAll({
      where: { category, isActive: true },
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
    })

    res.status(200).json({
      success: true,
      products,
    })
  } catch (error) {
    next(error)
  }
}

const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: { isActive: true, rating: { [Op.gte]: 4.5 } },
      limit: 8,
      order: [['rating', 'DESC']],
    })

    res.status(200).json({
      success: true,
      products,
    })
  } catch (error) {
    next(error)
  }
}

const searchProducts = async (req, res, next) => {
  try {
    const { query } = req.query

    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters.',
      })
    }

    const products = await Product.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
          { brand: { [Op.iLike]: `%${query}%` } },
        ],
      },
      limit: 20,
    })

    res.status(200).json({
      success: true,
      products,
    })
  } catch (error) {
    next(error)
  }
}

const updateStock = async (req, res, next) => {
  try {
    const { id } = req.params
    const { quantity } = req.body

    const product = await Product.findByPk(id)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      })
    }

    product.stock = product.stock - quantity
    await product.save()

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully.',
      product,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getFeaturedProducts,
  searchProducts,
  updateStock,
}
