const Product = require('../models/product');
const mongodb = require('mongodb');

exports.getProducts = (req, res, next) => {
    // fectchAll takes a call back so it doesn't block!
    Product
        .fetchAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
        .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
    // fectchAll takes a call back so it doesn't block!
    const productId = req.params.productId;
    Product
        .findById(productId)
        // .findAll({where: {id: productId}})
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
    Product
        .fetchAll()
        .then(products => {
            // console.log(products);
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(products => {
            res.render('shop/cart', {
                prods: products,
                pageTitle: 'Your Cart',
                path: '/cart'
            });
        })
        .catch(err => console.log(err));
};


exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product
        .findById(productId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user
        .deleteItemFromCart(productId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders()
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Your Orders',
                path: '/orders',
                orders: orders
            });
        });
};

exports.postOrders = (req, res, next) => {
    req.user
        .addOrder()
        .then(result => {
            // console.log("\n\n\n\n\n\n");
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};


exports.getCheckout = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/checkout', {
            prods: products,
            pageTitle: 'Checkout',
            path: '/checkout',
        });
    });
};