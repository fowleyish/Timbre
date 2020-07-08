const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../config/auth');
const axios = require('axios');
const User = require('../models/index').user;
const validateToken = require('../config/refreshtoken');

router.get('/', ensureAuth, async (req, res) => {
    if (req.user.SpotifyRefreshToken == null) {
        console.log(spotAuthUrl);
        res.render('setup', {
            user: req.user
        })
    } else {
        if (req.user.Following !== null) {
            const allTimbreUsers = await User.findAll();
            allTimbreUsers.forEach(async el => {
                if (el._previousDataValues.SpotifyRefreshToken !== null) {
                    await validateToken(el._previousDataValues);
                }
            });

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

            const myTop10Artists = await axios({
                url: 'https://api.spotify.com/v1/me/top/artists?limit=10&time_range=medium_term',
                    method: 'get',
                    headers: {
                        'Accept':'application/json',
                        'Content-Type':'application/json',
                        'Authorization':'Bearer ' + req.user.SpotifyToken
                    }
            });

            const allUsers = await User.findAll();
            let allUsersTopArtists = [];
            for(let i=0; i<allUsers.length; i++) {
                if (allUsers[i]._previousDataValues.SpotifyToken != null) {
                    const thisUsersTop10Artists = await axios({
                        url: 'https://api.spotify.com/v1/me/top/artists?limit=10&time_range=medium_term',
                        method: 'get',
                        headers: {
                            'Accept':'application/json',
                            'Content-Type':'application/json',
                            'Authorization':'Bearer ' + allUsers[i]._previousDataValues.SpotifyToken
                        }
                    })
                    for(let j=0; j<thisUsersTop10Artists.data.items.length; j++) {
                        for(let k=0; k<myTop10Artists.data.items.length; k++) {
                            if (thisUsersTop10Artists.data.items[j].id == myTop10Artists.data.items[k].id) {
                                let newUserMatch = {
                                    Username: allUsers[i]._previousDataValues.Username,
                                    City: allUsers[i]._previousDataValues.City,
                                    StateProv: allUsers[i]._previousDataValues.StateProv,
                                    Avatar: allUsers[i]._previousDataValues.Avatar,
                                    UserId: allUsers[i]._previousDataValues.UserId,
                                    ArtistMatch: thisUsersTop10Artists.data.items[j].name
                                }
                                allUsersTopArtists.push(newUserMatch);
                            }
                        }
                    }
                }
            }

            let uniqueUserMatchDict = {};
            for(let i=0; i<allUsersTopArtists.length; i++) {
                if (allUsersTopArtists[i].UserId !== req.user.UserId) {
                    let following = JSON.parse(req.user.Following);
                    if (!(following.includes(allUsersTopArtists[i].UserId.toString()))) {
                        uniqueUserMatchDict[allUsersTopArtists[i].UserId] = allUsersTopArtists[i];
                    }
                }
            }

            let recommendedArtists = [];
            for(let i=0; i<resolvedFollowingList.length; i++) {
                const followingTop10Artists = await axios({
                    url: 'https://api.spotify.com/v1/me/top/artists?limit=10&time_range=medium_term',
                    method: 'get',
                    headers: {
                        'Accept':'application/json',
                        'Content-Type':'application/json',
                        'Authorization':'Bearer ' + resolvedFollowingList[i]._previousDataValues.SpotifyToken
                    }
                })
                for(let j=0; j<followingTop10Artists.data.items.length; j++) {
                    for(let k=0; k<myTop10Artists.data.items.length; k++) {
                        if (followingTop10Artists.data.items[j].id !== myTop10Artists.data.items[k].id) {
                            let newArtistToDiscover = {
                                ArtistArt: followingTop10Artists.data.items[j].images[0].url,
                                ArtistName: followingTop10Artists.data.items[j].name,
                                ArtistLink: followingTop10Artists.data.items[j].external_urls.spotify,
                                Genres: followingTop10Artists.data.items[j].genres,
                                ListenedToBy: resolvedFollowingList[i].Username
                            }
                            recommendedArtists.push(newArtistToDiscover);
                        }
                    }
                }
            }

            let uniqueArtistsDict = {};
            for(let i=0; i<recommendedArtists.length; i++) {
                uniqueArtistsDict[recommendedArtists[i].ArtistName] = recommendedArtists[i];
            }

            res.render('dashboard', {
                user: req.user,
                following: resolvedFollowingList,
                feed: recentlyPlayedTotal,
                peopleToDiscover: uniqueUserMatchDict,
                artistsToDiscover: uniqueArtistsDict
            });
        } else {
            res.render('dashboard', {
                user: req.user
            });
        }
    }
});

module.exports = router;