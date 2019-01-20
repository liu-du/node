const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const errHandler = require('../misc/error-handler');

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed...');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email: email,
        password: hashedPassword,
        name: name,
        posts: []
      });

      return user.save();
    })
    .then(user => {
      console.log('User created.');
      return res
        .status(201)
        .json({ message: 'User Created', userId: user._id });
    })
    .catch(err => next(errHandler(err)));
};
