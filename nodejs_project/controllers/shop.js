const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    // fectchAll takes a call back so it doesn't block!
    Product
        .fetchAll()
        .then(([rows, fieldData]) => {
            res.render('shop/product-list', {
                prods: rows,
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
        .then(([[p]]) => {
            res.render('shop/product-detail', {
                product: p,
                pageTitle: p.title,
                path: '/products'
            });
        })
        .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
    Product
        .fetchAll()
        .then(([rows, fieldData]) => {
            console.log(rows);
            console.log(fieldData);
            res.render('shop/index', {
                prods: rows,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => console.log(err));

};

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(p => p.id === product.id);
                if (cartProductData) {
                    cartProducts.push({productData: product, qty: cartProductData.qty});
                }
            }
            res.render('shop/cart', {
                prods: cartProducts,
                pageTitle: 'Your Cart',
                path: '/cart'
            });
        });
    });
};


exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, p => {
        Cart.addProduct(productId, p.price);
        res.redirect('/cart');
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, product => {
        Cart.deleteProduct(productId, product.price);
        res.redirect('/cart');
    });
};

exports.getOrders = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/orders', {
            prods: products,
            pageTitle: 'Your Orders',
            path: '/orders'
        });
    });
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