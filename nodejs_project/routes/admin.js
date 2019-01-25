const express = require('express');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const { body } = require('express-validator/check');

const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProduct);

router.post(
  '/add-product',
  [
    body(
      'title',
      'Title must only contains text and number with at least 3 characters.'
    )
      .trim()
      .isLength({ min: 3 })
      .isString(),
    body('price').isFloat(),
    body('description').trim()
  ],
  isAuth,
  adminController.postAddProduct
);

router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post(
  '/edit-product',
  [
    body(
      'title',
      'Title must only contains text and number with at least 3 characters'
    )
      .trim()
      .isLength({ min: 3 })
      .isString(),
    body('price', 'Price has to be a decimal number').isFloat(),
    body('description', 'Description cannot be blank')
      .trim()
      .isLength({ min: 1 })
  ],
  isAuth,
  adminController.postEditProduct
);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;
