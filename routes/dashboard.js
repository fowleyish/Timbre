const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../config/auth');
const axios = require('axios');
const User = require('../models/index').user;

router.get('/', ensureAuth, async (req, res) => {
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
            const resolvedFollowingList = await Promise.all(followingListPromises);
            let recentlyPlayedAll = [];
            for(let i=0; i<resolvedFollowingList.length; i++) {
                let thisRecentlyPlayed = axios({
                    url: 'https://api.spotify.com/v1/me/player/recently-played?limit=10',
                    method: 'get',
                    headers: {
                        'Accept':'application/json',
                        'Content-Type':'application/json',
                        'Authorization':'Bearer ' + resolvedFollowingList[i]._previousDataValues.SpotifyToken
                    }
                })
                recentlyPlayedAll.push(thisRecentlyPlayed);
            }
            const resolvedRecentlyPlayed = await Promise.all(recentlyPlayedAll);
            let recentlyPlayedTotal = [];
            for(let i=0; i<resolvedRecentlyPlayed.length; i++) {
                for(let j=0; j<resolvedRecentlyPlayed[i].data.items.length; j++) {
                    recentlyPlayedTotal.push(resolvedRecentlyPlayed[i].data.items[j]);
                }
            }

            res.render('dashboard', {
                user: req.user,
                following: resolvedFollowingList,
                feed: recentlyPlayedTotal
            });
        } else {
            res.render('dashboard', {
                user: req.user
            });
        }
    }
});

module.exports = router;