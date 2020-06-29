const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../config/auth');

router.get('/', ensureAuth, (req, res) => {
    if (req.user.SpotifyAuthUrl == null) {
        console.log(spotAuthUrl);
        res.render('setup', {
            user: req.user,
            spotAuth: spotAuthUrl
        })
    } else {
        res.render('dashboard', {
            user: req.user
        });
    }
});

module.exports = router;