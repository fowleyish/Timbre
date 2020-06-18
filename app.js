// npm modules
const dotenv = require('dotenv').config();
const express = require('express');
const app = express();

// Database connection
const database = process.env.SQL_DATABASE;
const username = process.env.SQL_USERNAME;
const password = process.env.SQL_PASSWORD;

const Sequelize = require('sequelize');

const models = require('./models/index');
try {
    models.sequelize.sync();
    console.log('Database is synced!');
} catch (e) {
    console.log('Migraton error: ', e);
}

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