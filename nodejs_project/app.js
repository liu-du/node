const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');
const app = express();
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://jimmy:mac.2018@cluster0-mzvi0.mongodb.net/shop';

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }));

app.use((req, res, next) => {
    User.findById("5c1222727611cf0b6a5a77dc")
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// use mongoose ORM (Object Document Mapper)
mongoose
    .connect(MONGODB_URI)
    .then(result => {
        console.log('\nConnected!\n');
        User.findOne()
            .then(user => {
                if (!user) {
                    const user = new User({
                        name: 'Jimmy',
                        email: 'jimmy@email.com',
                        cart: {
                            items: []
                        }
                    });
                    user.save();
                }
            });
        app.listen(3000);
    })
    .catch(console.log);