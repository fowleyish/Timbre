// npm modules
const dotenv = require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();

// Passport configuration
require('./config/passport')(passport);

// Import models
const models = require('./models/index');

// Sync models to DB
models.sequelize.sync({ force: true }).then(() => {
    console.log('Synced to database!');
}).catch((e) => {
    console.log('Error syncing to database: ', e);
}); 

// Configure view engine
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Define request middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Express session config
app.use(session({
    secret: 'asdf',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global Flash variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Spotify config
const SpotifyWebApi = require('spotify-web-api-node');
global.spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENTID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI
});
const scopes = ['playlist-read-private', 'user-read-recently-played', 'user-top-read', 'user-read-currently-playing', 'user-read-private', 'streaming'];
global.spotAuthUrl = spotifyApi.createAuthorizeURL(scopes);

// Importing routes
app.use('/users', require('./routes/users.js'));
app.use('/', require('./routes/home.js'));
app.use('/dashboard', require('./routes/dashboard.js'));
app.use('/callback', require('./routes/callback.js'));

// Environment variables
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});