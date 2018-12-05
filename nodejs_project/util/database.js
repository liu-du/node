const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'node-complete', 
    'root', 
    'mac.2018', 
    { dialect: 'mysql', host: 'localhost' });

module.exports = sequelize;