const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded, used for data submitted through form
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
    // Allow request from all IPs, Otherwise CORS (Cross Origin Resource Sharing) errors
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    // Allowed request methods
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    // Allowed header fields
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);

app.listen(8080, () => {
    console.log('\nConnected\n');
});