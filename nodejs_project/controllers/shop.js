const Product = require('../models/product');
const Order = require('../models/order');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require("stripe")("sk_test_LgObWrhstCfYjhHFFLpqwSIY");

const ITEMS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;

    Product.find().countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Product
                .find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .then(products => {
                    res.render('shop/product-list', {
                        prods: products,
                        pageTitle: 'All Products',
                        path: '/products',
                        currentPage: page,
                        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                        hasPreviousPage: page > 1,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
                    });
                })
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
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
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getIndex = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;

    Product.find().countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Product
                .find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .then(products => {
                    res.render('shop/index', {
                        prods: products,
                        pageTitle: 'Shop',
                        path: '/',
                        currentPage: page,
                        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                        hasPreviousPage: page > 1,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
                    });
                })
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
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
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
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
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user
        .removeFromCart(productId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
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
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};


exports.getCheckout = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;

            res.render('shop/checkout', {
                pageTitle: 'Checkout',
                path: '/checkout',
                products: products,
                totalSum: products.map(x => x.quantity * x.productId.price).reduce((x, y) => x + y)
            });
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postOrders = (req, res, next) => {

    // Token is created using Checkout or Elements!
    // Get the payment token ID submitted by the form:
    const token = req.body.stripeToken; // Using Express

    let totalSum;
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            totalSum = user.cart.items
                .map(p => p.quantity * p.productId.price)
                .reduce((x, y) => x + y);
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
            const charge = stripe.charges.create({
                amount: totalSum * 100,
                currency: 'aud',
                description: 'All orders',
                source: token,
                metadata: {order_id: result._id.toString()}
            });
            return req.user.clearCart();
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};



exports.getInvoices = (req, res, next) => {
    const orderId = req.params.orderId;
    const invoiceName = 'Invoice-' + orderId + '.pdf';
    const invoicePath = path.join('data', 'invoices', invoiceName);
    Order
        .findById(orderId)
        .then(order => {
            if (!order) {
                return next(new Error('No order found.'));
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Unauthorized'));
            }

            const pdfDoc = new PDFDocument();
            pdfDoc.pipe(fs.createWriteStream(invoicePath));

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
            pdfDoc.pipe(res);

            pdfDoc.fontSize(26).text('Invoice', { underline: true });
            pdfDoc.text('---------------------------------');

            let totalPrice = 0;
            order.products.forEach(prod => {
                totalPrice += prod.quantity * prod.product.price;
                pdfDoc
                    .fontSize(14)
                    .text(prod.product.title + ' - ' + prod.quantity + ' x ' + '$' + prod.product.price);
            });

            pdfDoc.text('\n\n\n----\n\n');
            pdfDoc.fontSize(20).text( 'Total price: $' + totalPrice );

            pdfDoc.end();
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}