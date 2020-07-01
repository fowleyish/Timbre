const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../config/auth');

router.get('/:id', ensureAuth, (req, res) => {
    res.render('profile', {
        user: req.user,
        id: id
    });
});

module.exports = router;