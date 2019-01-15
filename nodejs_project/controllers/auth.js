const crypto = require('crypto');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const sendGridApi = require('../misc/sendGridApi');
const { validationResult } = require('express-validator/check');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: sendGridApi()
    }
}));

exports.getLogin = (req, res, next) => {
    // no redirect so user can only get here by click login
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: undefined,
        messageType: 'info',
        oldInput: {email: '', password: ''},
        validationErrors: []
    });
};

exports.postLogin = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res
            .status(422)
            .render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: errors.array()[0].msg,
                messageType: 'error',
                oldInput: {
                    email: req.body.email,
                    password: req.body.password
                },
                validationErrors: errors.array()
            });
    }

    User
        .findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res
                    .status(422)
                    .render('auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        errorMessage: 'Email not signed up.',
                        messageType: 'error',
                        oldInput: {
                            email: req.body.email,
                            password: req.body.password
                        },
                        validationErrors: [{param: 'email'}]
                    });
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
                    return res
                        .status(422)
                        .render('auth/login', {
                            path: '/login',
                            pageTitle: 'Login',
                            errorMessage: 'Wrong password.',
                            messageType: 'error',
                            oldInput: {
                                email: req.body.email,
                                password: req.body.password
                            },
                            validationErrors: [{param: 'password'}]
                        });
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                })
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
        messageType = 'error';
    } else {
        message = 'Password must be number and text only and at least 5 characters';
        messageType = 'info';
    }
    res.render('auth/signup.ejs', {
        path: '/signup',
        pageTitle: 'Sign up',
        errorMessage: message,
        messageType: messageType,
        oldInput: {
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationErrors: []
    })
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).
            render('auth/signup.ejs', {
                path: '/signup',
                pageTitle: 'Sign up',
                errorMessage: errors.array()[0].msg,
                messageType: 'error',
                oldInput: {
                    email: email,
                    password: password,
                    confirmPassword: req.body.confirmPassword
                },
                validationErrors: errors.array()
            });
    }

    User.findOne({email: email})
        .then(userDoc => {
            bcrypt
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
                    return transporter.sendMail({
                        to: email,
                        from: 'ldiuukz@gmail.com',
                        subject: 'Sign up',
                        html: '<h1>You successfully signed up!</h1>'
                    })
                })
                .catch(err => {
                    console.log(err);
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                });
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
        messageType = 'error';
    } else {
        message = 'Password must be at least 3 characters';
        messageType = 'info';
    }

    res.render('auth/reset.ejs', {
        path: '/reset',
        pageTitle: 'Reset password',
        errorMessage: message,
        messageType: messageType
    });
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');

        User.findOne({email: req.body.email})
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with that email found.');
                    return res.redirect('/reset');
                }

                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                res.redirect('/');
                transporter.sendMail({
                    from: 'ldiuukz@gmail.com',
                    to: req.body.email,
                    subject: 'Password Reset shop@cat',
                    html: `
                        <p>You requested password reset</p>
                        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
                    `
                });
            })
            .catch(err => {
                console.log(err);
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    });
};

exports.getNewPassword = (req, res, next) => {

    const token = req.params.token;
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
        .then(user => {
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
                messageType = 'error';
            } else {
                message = 'Password must be at least 3 characters';
                messageType = 'info';
            }

            res.render('auth/new-password.ejs', {
                path: '/new-password',
                pageTitle: 'Set New Password',
                errorMessage: message,
                messageType: messageType,
                userEmail: user.email,
                passwordToken: token
            });
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postNewPassword = (req, res, next) => {
    const email = req.body.userEmail;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const token = req.body.passwordToken;

    User.findOne({email: email, resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
        .then(user => {
            if (password.length < 3) {
                req.flash('error', 'Password length has to be at least 3.');
                return res.redirect('/new-password');
            } else if (password !== confirmPassword) {
                req.flash('error', "Password doesn't agree.")
                return res.redirect('/new-password');
            }
            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    user.password = hashedPassword;
                    user.resetToken = undefined;
                    user.resetTokenExpiration = undefined;
                    user.save();
                })
                .catch(err => {
                    console.log(err);
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                });
        })
        .then(result => {
            res.redirect('/login');
            transporter.sendMail({
                to: email,
                from: 'ldiuukz@gmail.com',
                subject: 'Password change confirmation',
                html: '<h1>You successfully reset your password!</h1>'
            });
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};