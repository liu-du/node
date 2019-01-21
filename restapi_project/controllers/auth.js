const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadeduser;

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const error = new Error('User with this email could not be found');
        error.statusCode = 401;
        throw error;
      }
      loadeduser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Wrong password');
        error.statusCode = 401;
        throw error;
      }

      const token = jwt.sign(
        {
          email: loadeduser.email,
          userId: loadeduser._id.toString()
        },
        'secret',
        { expiresIn: '1h' }
      );

      res.status(200).json({ token: token, userId: loadeduser._id.toString() });
    })
    .catch(err => next(errHandler(err)));
};
