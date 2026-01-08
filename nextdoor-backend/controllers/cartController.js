const Cart = require('../models/Cart');
const Product = require('../models/Product');

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Check if item already in cart
    let cartItem = await Cart.findOne({
      where: { userId, productId },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        userId,
        productId,
        quantity,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item added to cart.',
      cartItem,
    });
  } catch (error) {
    next(error);
  }
};

const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{ model: Product, as: 'product' }],
    });

    // Calculate totals
    let subtotal = 0;
    const items = cartItems.map((item) => {
      const itemTotal = parseFloat(item.Product.price) * item.quantity;
      subtotal += itemTotal;
      return {
        id: item.id,
        product: item.Product,
        quantity: item.quantity,
        totalPrice: itemTotal,
      };
    });

    res.status(200).json({
      success: true,
      cart: {
        items,
        subtotal: parseFloat(subtotal.toFixed(2)),
        itemCount: items.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    const cartItem = await Cart.findOne({
      where: { id: cartItemId, userId },
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found.',
      });
    }

    if (quantity <= 0) {
      await cartItem.destroy();
      return res.status(200).json({
        success: true,
        message: 'Item removed from cart.',
      });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({
      success: true,
      message: 'Cart item updated.',
      cartItem,
    });
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { cartItemId } = req.params;
    const userId = req.user.id;

    const cartItem = await Cart.findOne({
      where: { id: cartItemId, userId },
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found.',
      });
    }

    await cartItem.destroy();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart.',
    });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await Cart.destroy({
      where: { userId },
    });

    res.status(200).json({
      success: true,
      message: 'Cart cleared.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
