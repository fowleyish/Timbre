const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('spotifyauth', {
        spotAuth: spotAuthUrl
    });
});

module.exports = router;