const path = require('path');
const rootDir = require('../util/path');
const express = require('express');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
    const products = adminData.products
    console.log('shop.js', adminData.products);
    res.render('shop', {prods: products, pageTitle: 'Shop', path: '/'});
});

module.exports = router;