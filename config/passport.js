const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/index').user;

module.exports = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({
        where: {
          Email: email
        }
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }
        bcrypt.compare(password, user.Password, (err, isMatch) => {
          if (err) {
            throw err;
          }
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'The password is incorrect' });
          }
        });
      });
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.UserId);
  });

  passport.deserializeUser((id, done) => {
    User.findByPk(id).then(user => {
      if (user) {
        done(null, user.get());
      } 
    });
  });
};