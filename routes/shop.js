const express = require('express');
const shopController = require('../controllers/shop')
const isAuth = require('../middleware/is-auth')

const router = express.Router();

// @route   GET /
// @desc    Get all products
// @access  Public
router.get('/', shopController.getProducts);

// @route   GET /products
// @desc    Get a certain product by id
// @access  Public
router.get('/products/:id', shopController.getOneProductById)

// @route   GET /cart
// @desc    Get products added in cart by a user
// @access  Public
router.get('/cart', isAuth, shopController.getCart)

// @route   POST /cart
// @desc    For users to add a product in a cart
// @access  Private
router.post('/cart', shopController.postCart)

// @route   POST /cart
// @desc    Removes a product from the cart
// @access  Private
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct)

module.exports = router;