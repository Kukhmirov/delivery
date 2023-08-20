const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {verify, findById} = require("../modules/authUsers");


const options = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: false,
};

passport.use('local', new LocalStrategy(options, verify));

passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
    findById(id, (err, user) => {
        if (err) {
            return cb(err);
        }

        cb(null, user);
    });
});

module.exports = {passport};