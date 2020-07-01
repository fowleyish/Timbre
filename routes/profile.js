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

module.exports = router;