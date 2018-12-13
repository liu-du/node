const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const app = express();
const User = require('./models/user');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
    User.findById("5c1222727611cf0b6a5a77dc")
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use(errorController.get404);

// use mongoose ORM (Object Document Mapper)
mongoose
    .connect('mongodb+srv://jimmy:mac.2018@cluster0-mzvi0.mongodb.net/shop?retryWrites=true')
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