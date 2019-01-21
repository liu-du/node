const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');
const isAuth = require('../middleware/is-auth');

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('Email address already signed up!');
          }
          return true;
        });
      })
      .normalizeEmail(),
    body('password').isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],
  authController.signup
);

router.post('/login', authController.login);

router.get('/status', isAuth, authController.getStatus);

router.put('/updateStatus', isAuth, authController.updateStatus);

module.exports = router;
