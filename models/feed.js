const { Sequelize, DataTypes } = require('sequelize');
module.exports = function(sequelize, Sequelize) {
    const Feed = sequelize.define('feed', {
        PostId: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        UserId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'UserId'
            }
        },
        Ts: {
            type: DataTypes.DATE,
            allowNull: false
        },
        TrackTitle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        TrackArtist: {
            type: DataTypes.STRING,
            allowNull: false
        },
        TrackAlbum: {
            type: DataTypes.STRING,
            allowNull: false
        },
        AlbumArt: {
            type: DataTypes.STRING,
            allowNull: false
        },
        SpotifyLink: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, 
    {
        freezeTableName: true
    });
    return Feed;
}