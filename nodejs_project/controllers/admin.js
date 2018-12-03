const Product = require('../models/product');

// /admin/add-product => GET
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

// /admin/product => POST
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product(null, title, imageUrl, description, price);
    product.save().then(() => res.redirect('/')).catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    } 
    const productId = req.params.productId;

    Product.findById(productId, product => {
        if (!product) {
            res.redirect('/');
        } else {
            res.render('admin/edit-product', {
                pageTitle: 'Edit product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
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
    const updatedProduct = new Product(productId, updatedTitle, updatedImageUrl, updatedDescription, updatedPrice);
    updatedProduct.save();
    res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'All Products',
            path: '/admin/products'
        });
    });
};

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.delete(productId);
    res.redirect('/admin/products');
};
