const { Sequelize, DataTypes } = require('sequelize');
module.exports = function(sequelize, Selquelize) {
    const User = sequelize.define('user', {
        UserId: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        Username: {
            type: DataTypes.STRING,
            len: [4, 14]
        },
        Password: {
            type: DataTypes.STRING
        },
        Email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true
            }
        },
        SpotifyToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        SpotifyRefreshToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        City: {
            type: DataTypes.STRING
        },
        StateProv: {
            type: DataTypes.STRING
        },
        Country: {
            type: DataTypes.STRING
        },
        Avatar: {
            type: DataTypes.STRING,
            allowNull: true
        },
        SpotifyProfUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true
            }
        },
        FacebookProfUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true
            }
        },
        TwitterProfUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true
            }
        },
        InstaProfUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true
            }
        },
        SoundcloudProfUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true
            }
        },
        ProfileBlurb: {
            type: DataTypes.STRING(500),
            allowNull: true,
            validate: {
                len: [1, 500]
            }
        },
        Following: {
            type: DataTypes.STRING(3000)
        }
    });
    return User;
}