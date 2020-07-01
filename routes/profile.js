const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../config/auth');

router.get('/', ensureAuth, (req, res) => {
    res.render('profile', {
        user: req.user
    });
});

module.exports = router;