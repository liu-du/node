const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id, productPrice) {
        // Fetch All
        fs.readFile(p, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0};
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            // check if product is already in cart
            const existingProductIndex = cart.products.findIndex(p => p.id === id);
            let existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            // update the cart
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1};
                cart.products = [...cart.products, updatedProduct];
            }

            cart.totalPrice = cart.totalPrice + +productPrice;

            // write back updated card to disk
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
        });
    };

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            cb(err ? {products: [], totalPrice: 0} : JSON.parse(fileContent));
        });
    };

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }
            const cart = JSON.parse(fileContent);
            const updatedCart = { ...cart };
            const product = updatedCart.products.find(p => p.id === id);
            if (!product) {
                return;
            }
            const productQty = product.qty;

            updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;
            updatedCart.products = updatedCart.products.filter(p => p.id !== id);

            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                console.log(err);
            });
        });
    }
};