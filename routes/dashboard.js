const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../config/auth');
const axios = require('axios');
const User = require('../models/index').user;

router.get('/', ensureAuth, (req, res) => {
    if (req.user.SpotifyRefreshToken == null) {
        console.log(spotAuthUrl);
        res.render('setup', {
            user: req.user
        })
    } else {
        if (req.user.Following !== null) {
            const followingList = JSON.parse(req.user.Following);
            let followingListPromises = [];
            for(let i=0; i<followingList.length; i++) {
                let userProm = User.findOne({
                    where: {
                        UserId: followingList[i]
                    }
                })
                followingListPromises.push(userProm);
            }
            Promise.all(followingListPromises)
            .then((following) => {
                res.render('dashboard', {
                    user: req.user,
                    following: following
                });
            })
        } else {
            res.render('dashboard', {
                user: req.user
            });
        }
    }
});

module.exports = router;