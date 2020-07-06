const User = require('../models/index').user;
const axios = require('axios');

module.exports = async (user) => {
    try {
        const attempt = await axios({
            method: 'get',
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Accept':'application/json',
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + user.SpotifyToken
            }
        })
    } catch (err) {
        const authBase = Buffer.from(process.env.SPOTIFY_CLIENTID+':'+process.env.SPOTIFY_CLIENT_SECRET).toString('base64');
        try {
            const refreshAuth = await axios({
                url: 'https://accounts.spotify.com/api/token?grant_type=refresh_token&refresh_token='+user.SpotifyRefreshToken,
                method: 'POST',
                headers: {
                    'Content-Type':'application/x-www-form-urlencoded',
                    'Authorization':'Basic ' + authBase
                }
            })
            console.log(refreshAuth);
            await User.update({ SpotifyToken: refreshAuth.data.access_token }, { where: { UserId: user.UserId } })
        } catch (err) {
            console.log(err);
        }
    }
}