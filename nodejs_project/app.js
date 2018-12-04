const path = require('path');
const express = require('express');

const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
})

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

Cart.belongsTo(User)
User.hasOne(Cart);

Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});



sequelize
    // .sync({force: true})
    .sync()
    .then(_ => {
        return User.findById(1);
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Jimmy', email: 'jimmy@email.com' });
        }
        return user;
    })
    .then(user => {
        return user.createCart();
    })
    .then(cart => {
        return app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
