spotifyAuthUrl = () => {
    var SpotifyWebApi = require('spotify-web-api-node');
    var scopes = ['playlist-read-private', 'user-read-recently-played', 'user-top-read', 'user-read-currently-playing', 'user-read-private', 'streaming'];
    var redirectUri = process.env.SPOTIFY_REDIRECT_URI;
    var clientId = process.env.SPOTIFY_CLIENTID;
    var clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    var credentials = {
        clientId: clientId,
        clientSecret: clientSecret,
        redirectUri: redirectUri
    };

    var spotifyApi = new SpotifyWebApi(credentials);
    console.log(spotifyApi);

    var authorizeUrl = spotifyApi.createAuthorizeURL(scopes);
    return authorizeUrl;
}