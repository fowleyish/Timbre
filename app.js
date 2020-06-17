// npm modules
const dotenv = require('dotenv').config();
const express = require('express');
const app = express();

// Database connection
const database = process.env.SQL_DATABASE;
const username = process.env.SQL_USERNAME;
const password = process.env.SQL_PASSWORD;

const Sequelize = require('sequelize');

const sequelize = new Sequelize(database, username, password, {
    host: 'localhost',
    port: '1433',
    dialect: 'mssql'
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connected to database', database);
    })
    .catch(err => {
        console.error('Error connecting to database: ', err);
    })

// Importing routes
const users = require('./routes/users');
const home = require('./routes/home');

// Configure view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Define request middleware
app.use('/api/users', users);
app.use('/', home);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Environment variables
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});