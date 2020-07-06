const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../config/auth');
const { parse } = require('path');
const User = require('../models/index').user;
const axios = require('axios');

router.get('/:id', ensureAuth, async (req, res) => {
    const [thisUser, myTopArtists] = await Promise.all([
        User.findOne({
            where: {
                UserId: req.params.id
            }
        }),
        axios({
            url: 'https://api.spotify.com/v1/me/top/artists?limit=100&time_range=medium_term',
            method: 'get',
            headers: {
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + req.user.SpotifyToken
            }
        })
    ]);

    const theirTopArtists = await Promise.all([
        axios({
            url: 'https://api.spotify.com/v1/me/top/artists?limit=100&time_range=medium_term',
            method: 'get',
            headers: {
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + thisUser.SpotifyToken
            }
        })
    ]);

    const myTop100 = myTopArtists.data.items;
    const theirTop100 = theirTopArtists[0].data.items;
    let mutualArtists = [];
    for(let i=0; i<myTop100.length; i++) {
        for(let j=0; j<theirTop100.length; j++) {
            if (myTop100[i].id === theirTop100[j].id) {
                mutualArtists.push(myTop100[i]);
            }
        }
    }

    res.render('profile', {
        user: req.user,
        thisUser: thisUser._previousDataValues,
        topArtists: theirTopArtists,
        mutualArtists: mutualArtists
    });
});

router.get('/follow/:thisUserId', (req, res) => {
    const userToFollow = req.params.thisUserId;
    const currentUser = req.user;
    if (currentUser.Following == null) {
        const followingList = [userToFollow];
        const serializedFollowingList = JSON.stringify(followingList);
        User.update({ Following: serializedFollowingList }, { where: { UserId: currentUser.UserId } })
        .then(user => console.log('You are now following this user!'))
        .then(user => res.redirect('localhost:3000/profile/'+userToFollow))
        .catch(err => console.log(err));
    } else {
        const parsedFollowingList = JSON.parse(currentUser.Following);
        parsedFollowingList.push(userToFollow);
        const stringifiedFollowingList = JSON.stringify(parsedFollowingList);
        User.update({ Following: stringifiedFollowingList }, { where: { UserId: currentUser.UserId } })
        .then(user => console.log('You are now following this user!'))
        .then(user => res.redirect('localhost:3000/profile/'+userToFollow))
        .catch(err => console.log(err));
    }
});

router.get('/unfollow/:thisUserId', (req, res) => {
    const userToUnfollow = req.params.thisUserId;
    const currentUser = req.user;
    const parsedFollowingList = JSON.parse(currentUser.Following);
    const filteredFollowingList = parsedFollowingList.filter(x => x !== userToUnfollow);
    const stringifiedFollowingList = JSON.stringify(filteredFollowingList);
    User.update({ Following: stringifiedFollowingList }, { where: { UserId: currentUser.UserId } })
    .then(user => console.log('You are now following this user!'))
    .then(user => res.redirect('localhost:3000/profile/'+userToFollow))
    .catch(err => console.log(err));
});

module.exports = router;