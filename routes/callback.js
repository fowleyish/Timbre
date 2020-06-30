const express = require('express');
const router = express.Router();
const User = require('../models/index').user;

router.get('/', async (req, res) => {
  const { code } = req.query;
  console.log(code);
  try {
    var data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);
    const spotifyTokens = {
        SpotifyToken: access_token,
        SpotifyRefreshToken: refresh_token
    };
    User.update(spotifyTokens, { where: { UserId: req.user.UserId } })
    .then(user => {
        console.log('Spotify tokens set!');
    })
    .catch(err => console.log(err));
  } catch (e) {
      console.log(e);
  }

  res.redirect('/dashboard');
});

module.exports = router;