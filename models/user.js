const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
        UserId: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        Username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        SpotifyToken: {
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
            allowNull: true
        },
        FacebookProfUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        TwitterProfUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        InstaProfUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        SoundcloudProfUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ProfileBlurb: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        Following: {
            type: DataTypes.STRING(3000)
        }
    });
    return User;
}