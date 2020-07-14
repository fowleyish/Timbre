# What is Timbre?
Timbre is a web application I built as my final project with devCodeCamp, a 12-week software development bootcamp program from which I recently graduated. It can best be described as a social networking site without all the noise you’d expect from a modern social media platform. It is a site simple in both design and functionality, focusing on creating connections and building networks based on music interests. With Timbre, users connect their Spotify profile to their account to:

- Find new users to connect with based on similar music interests
- Discover new artists and songs based on the interests of their network
- Easily identify a Timbre user’s favorite artists as well as all artists and musical interests you have in common
- Maintain a user profile that includes links to other, more complex social media platforms including Facebook, Instagram, and Twitter.

As a huge music fan and someone passionate about discovering new music, I wanted to emulate other fan-made music-discovery applications I’ve found throughout the years including [Discover Quickly](https://discoverquickly.com/) and [Every Noise](http://everynoise.com/), but add a social spin on it to introduce a sense of community to help curious minds connect. Presently, the application has a handful of bugs and more than a few areas that could use some code optimization, but it’s my hope to have this publicly hosted at some point to give music lovers (including myself) a new avenue to discover new music.

### Watch my demo of Timbre [here](https://www.youtube.com/watch?v=dYSMO1NuO_8&t=14s)

# How does it work?
Timbre uses the following tech stack:
- Node and Express.js for runtime
- Passport.js for user authentication and management
- MSSQL and [Sequelize](https://sequelize.org/) to store users and user context
- [Spotify API](https://developer.spotify.com/) to access user’s music preferences and listening history (future goal: add the ability to connect other music streaming APIs including Apple Music and Soundcloud)
- Custom [EJS](https://ejs.co/)/CSS front-end (sorry kids, no Bootstrap :man_shrugging:)

This was my first go ever with this tech stack (first time building with Node and Express, even), but plan to continue to work on this application in my down time. I invite any and all developers to collaborate if anyone is interested and will keep an eye on pull requests :nerd_face:

# Gallery
### Home/landing page, pre-logged in
![Image of Timbre landing page](/assets/homepage.png)
### Logged in user's dashboard
![Image of logged in user's dashboard](/assets/myDashboard.png)
### Logged in user's profile
![Image of logged in user's profile](/assets/myProfile.png)
### Logged in, looking at another user's profile
![Image of another user's profile](/assets/otherProfile.png)
 
 
 
# Steps to run locally
1. Prerequisites: [Node](https://nodejs.org/en/) (latest stable build), [Microsoft SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads), a [Spotify App](https://developer.spotify.com/documentation/general/guides/app-settings/), and [SSMS](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver15) (optional, but helpful)
2. Create an empty database; I named mine Timbre. The application will automatically create the necessary table and columns on runtime.
3. Clone or download this repo
4. Run `npm install` to install dependencies (NOTE: at present, not all dependencies are in use)
5. Create a `.env` file in the root directory with the following environment variables:

>    `PORT=`[Your Express port; 3000 is the default]
>
>    `SQL_DATABASE=`[Database name; this must be created in SSMS ahead of time]
>
>    `SQL_USERNAME=`[An admin user in SQL; this user must connect with SQL credentials, not Windows credentials]
>
>    `SQL_PASSWORD=`[Password for the SQL user]
>
>    `SPOTIFY_REDIRECT_URI=`[A callback address for use with the Spotify API; example: http://localhost:3000/callback]
>
>    `SPOTIFY_CLIENTID=`[Client ID of your Spotify Web Application]
>
>    `SPOTIFY_CLIENT_SECRET=`[Client Secret of your Spotify Web Application]

6. In the terminal, run `npm run devStart` to start the application. Visit `localhost:[Your Express port]` to start the application

# Known issues/future work
:x: Follow/unfollow buttons do not re-render the page on another user’s profile

:x: Bugs in Spotify token refresh process that requires users to submit forms twice on occasion 

:x: Edit Profile POST method in users route is not functioning as expected

:x: /dashboard GET method requires heavy code refactoring for performance optimization

:x: App is not mobile-responsive

:x: First-time log in users: dashboard does not have any recommended people to follow

:x: There are some unneeded dependencies and one unused database model
