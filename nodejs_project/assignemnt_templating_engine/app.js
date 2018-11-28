const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

const users = [];

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
    res.render('home', {pageTitle: 'Home', users: users});
});

app.get('/users', (req, res, next) => {
    res.render('users', {pageTitle: 'Add Users', users: users});
});

app.post('/add-users', (req, res, next) => {
    users.push(req.body.user)
    console.log(users)
    res.redirect('/');
});

app.listen(3000);