const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/index').user;
const SpotifyWebApi = require('spotify-web-api-node');

// Route to register page
router.get('/register', (req, res) => {
    res.render('register');
});

// POST: Register
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    let errors = [];
    if (!username || !email || !password) {
        errors.push({ message: 'All fields are required' });
    }
    if (password.length < 6 || password.length > 15) {
        errors.push({ message: 'Password must be between 6 and 15 characters' });
    }
    if (errors.length > 0) {
        res.render('register', {
            errors,
            username,
            email,
            password
        });
    } else {
        User.findOne({
            where: {
                Email: email
            }
        })
        .then(user => {
            if (user) {
                errors.push({ message: 'This email is already registered'});
                res.render('register', {
                    errors,
                    username,
                    email,
                    password
                });
            } else {

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) {
                            throw err;
                        }
                        const hashedPassword = hash;
                        User.create({ Username: username, Password: hashedPassword, Email: email }).then(user => {
                            req.flash(
                                'success_msg',
                                'You are now registered and can log in'
                            );
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                    });
                });
            }
        });
    }
});

// Route to login page
router.get('/login', (req, res) => {
    res.render('login');
});

// POST: Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    }) (req, res, next);
});

// GET: Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_message', 'You have logged out');
    res.redirect('/');
});

// PUT: Edit profile, first time setup

router.post('/edit', (req, res) => {
    const profileInfo = {
        City: req.body.city,
        StateProv: req.body.state,
        Country: req.body.country,
        SpotifyProfUrl: req.body.spotifyUrl,
        FacebookProfUrl: req.body.facebook,
        TwitterProfUrl: req.body.twitter,
        InstaProfUrl: req.body.instagram,
        SoundcloudProfUrl: req.body.soundcloud,
        ProfileBlurb: req.body.about,
        Avatar: req.body.avatar
    };
    User.update(profileInfo, { where: { UserId: req.user.UserId } })
    .then(user => {
        console.log('User updated!');
    })
    .catch(err => console.log(err));

    res.redirect('/spotifyauth');
});

module.exports = router;