const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../config/auth');
const User = require('../models/index').user;

router.get('/:id', ensureAuth, (req, res) => {
    User.findOne({
        where: {
            UserId: req.params.id
        }
    })
    .then(targetUser => {
        res.render('profile', {
            user: req.user,
            thisUser: targetUser
        });
    })
    .catch(err => console.log(err));
});

module.exports = router;