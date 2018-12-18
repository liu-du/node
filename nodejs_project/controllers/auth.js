const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').split("=")[1] === 'true';
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.postLogin = (req, res, next) => {
    User.findById("5c1222727611cf0b6a5a77dc")
        .then(user => {
            req.session.user = user;
            req.session.isLoggedIn = true;
            req.session.save((err) => {
                console.log(err);
                res.redirect('/');
            })
        })
        .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}