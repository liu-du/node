const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').split("=")[1] === 'true';
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message
    });
};

exports.postLogin = (req, res, next) => {
    User
        .findOne({
            email: req.body.email, 
        })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email.');
                return res.redirect('/login');
            }

            bcrypt
                .compare(req.body.password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.user = user;
                        req.session.isLoggedIn = true;
                        return req.session.save((err) => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Invalid password.');
                    return res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                })
        })
        .catch(err => console.log(err));
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
        messageType = 'error';
    } else {
        message = 'Password must be at least 3 characters';
        messageType = 'info';
    }
    res.render('auth/signup.ejs', {
        path: '/signup',
        pageTitle: 'Sign up',
        errorMessage: message,
        messageType: messageType
    })
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPssword = req.body.confirmPssword;

    User.findOne({email: email})
        .then(userDoc => {
            if (userDoc) {
                req.flash('error', 'Already signed up.')
                return res.redirect('/signup');
            } else if (password.length < 3) {
                req.flash('error', 'Password length has to be at least 3.');
                return res.redirect('/signup');
            } else if (password !== confirmPssword) {
                req.flash('error', "Password doesn't agree.")
                return res.redirect('/signup');
            }

            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] }
                    })
                    return user.save();
                })
                .then(result => {
                    res.redirect('/login');
                });
        })
        .catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}