const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const { code } = req.query;
  console.log(code);
  try {
    var data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);
    res.redirect('http://localhost:3000/dashboard');
  } catch (e) {
      console.log(e);
  }
});

module.exports = router;