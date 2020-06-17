// npm packages
const dotenv = require('dotenv').config();
const express = require('express');
const app = express();

// Define middleware
app.use(express.json());

// Environment variables
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Testing!!!!');
});

app.get('/api/users', (req, res) => {
    res.send([1, 2, 3, 4]);
});

app.get('/api/users/:id', (req, res) => {
    res.send(req.params.id);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});