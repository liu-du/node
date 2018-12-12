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


// app.use((req, res, next) => {
//     User.findById("5c0f8ac38a7dd0056dced5c5")
//         .then(user => {
//             req.user = new User(user.name, user.email, user.cart, user._id);
//             next();
//         })
//         .catch(err => console.log(err));
// });

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use(errorController.get404);

// use mongoose ORM (Object Document Mapper)
mongoose
    .connect('mongodb+srv://jimmy:mac.2018@cluster0-mzvi0.mongodb.net/shop?retryWrites=true')
    .then(result => {
        app.listen(3000);
    })
    .catch(console.log);