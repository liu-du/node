const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { check, body } = require('express-validator/check');
const User = require('../models/user');

router.get('/login', authController.getLogin);

router.post('/login', [
    body('email', 'Please enter a valid email address.')
        .isEmail(),
    body('password', 'Please enter a password with only numbers and text and at least 5 characters.')
        .isLength({ min: 5 })
        .isAlphanumeric()
], authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, {req}) => {
            return User.findOne({email: value})
                .then(userDoc => {
                    if (userDoc) return Promise.reject('This email address is already registered, pick a different one.');
                    
                })
        }),
    body('password', 'Please enter a password with only numbers and text and at least 5 characters.')
        .isLength({min: 5})
        .isAlphanumeric()
        .custom((value, { req }) => {
            if (value !== req.body.confirmPassword) throw new Error('Passwords don\'t match.');
            return true;
        })
], authController.postSignup);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
