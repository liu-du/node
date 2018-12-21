const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    // fectchAll takes a call back so it doesn't block!
    Product.find()
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
        .find()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
    // console.log(req.session.user);
    req.user
        // .select('cart')
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
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
        .removeFromCart(productId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    Order
        .find({"user.userId": req.user._id})
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
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const order = new Order({
                products: 
                    user.cart.items.map(item => {
                        return {quantity: item.quantity, product: { ...item.productId._doc }}
                    }),
                user: {
                    userId: req.user,
                    email: req.user.email
                }
            });
            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(result => {
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