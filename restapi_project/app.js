const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded, used for data submitted through form
app.use(bodyParser.json()); // application/json

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  // Allow request from all IPs, Otherwise CORS (Cross Origin Resource Sharing) errors
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Allowed request methods
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  // Allowed header fields
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const statusCode = error.statusCode || 500;
  const message = error.message;
  res.status(statusCode).json({ message: message });
});

mongoose
  .connect(
    'mongodb+srv://jimmy:mac.2018@cluster0-mzvi0.mongodb.net/messages?retryWrites=true'
  )
  .then(result => {
    app.listen(8080);
  })
  .then(result => {
    console.log('\nConnected\n');
  })
  .catch(err => {
    console.log('Error: ', err);
  });
