const Product = require('../models/product');

// /admin/add-product => GET
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated: req.isLoggedIn
    });
};

// /admin/product => POST
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
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
        .catch(err => console.log(err));
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
                    product: product,
                    isAuthenticated: req.isLoggedIn
                });
            };
        });
};

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    Product
        .findById(productId)
        .then(product => { 
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDescription;
            product.imageUrl = updatedImageUrl;
            return product.save();
        })
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
    Product
        .find()
        .select('title price -_id') // select is like select in sql...
        .populate('userId', 'name') // populate is kind of like a join
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'All Products',
                path: '/admin/products',
                isAuthenticated: req.isLoggedIn
            });
        });
};

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product
        .findByIdAndRemove(productId)
        .then(_ => res.redirect('/admin/products'))
        .catch(err => console.log(err));
};
