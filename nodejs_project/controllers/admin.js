const Product = require('../models/product');
const { validationResult } = require('express-validator/check');

// /admin/add-product => GET
exports.getAddProduct = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        errorMessage: null,
        hasError: false,
        validationErrors: []
    });
};

// /admin/product => POST
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const image = req.file;
    const description = req.body.description;
    const price = req.body.price;

    if (!image) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price, 
                description: description 
            },
            errorMessage: 'Attached file is not an image',
            validationErrors: []
        }); 
    }

    // console.log(image);
    const imageUrl = image.path;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            errorMessage: errors.array()[0].msg,
            product: {
                title: title,
                price: price, 
                description: description, 
                imageUrl: imageUrl
            },
            validationErrors: errors.array()
        });
    }

    const product = new Product({
        title: title, 
        price: price, 
        description: description, 
        imageUrl: imageUrl,
        userId: req.user
    });

    product
        .save()
        .then(result => {
            console.log('Created Product');
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    } 
    const productId = req.params.productId;

    Product
        .findById(productId)
        .then(product => {
            if (!product) {
                res.redirect('/');
            } else {
                res.render('admin/edit-product', {
                    pageTitle: 'Edit product',
                    path: '/admin/edit-product',
                    editing: editMode,
                    hasError: false,
                    errorMessage: null,
                    product: product,
                    validationErrors: []
                });
            };
        });
};

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const updatedTitle = req.body.title;
    const image = req.file;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('admin/edit-product', {
            pageTitle: 'Edit product',
            path: '/admin/edit-product',
            editing: true,
            hasError: true,
            errorMessage: errors.array()[0].msg,
            product: {
                title: updatedTitle,
                price: updatedPrice, 
                description: updatedDescription, 
                _id: req.body.productId
            },
            validationErrors: errors.array()
        });
    }

    Product
        .findById(productId)
        .then(product => { 
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDescription;
            if (image) {
                product.imageUrl = image.path;
            } 
            return product
                .save()
                .then(result => {
                    res.redirect('/admin/products');
                });
        })
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getProducts = (req, res, next) => {
    Product
        .find({userId: req.user._id})
        // .select('title price -_id') // select is like select in sql...
        .populate('userId', 'name') // populate is kind of like a join
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'All Products',
                path: '/admin/products'
            });
        });
};

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product
        .deleteOne({_id: productId, userId: req.user._id})
        .then(_ => res.redirect('/admin/products'))
        .catch(err => {
            console.log(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
