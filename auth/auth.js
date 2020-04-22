const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const userDAO = require('../Model/user.js');
const bcrypt = require('bcrypt');

exports.init = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());

    // setup password
    passport.use(new Strategy(
        // cb is a callback
        function (username, password, cb) {
            userDAO().lookup(username, function (err, user) {
                console.log('lookup', username);
                if (err) {
                    console.log('... error', err); 
                    return cb(err);
                }
                if (!user) {
                    console.log('user', username, 'not found');
                    return cb(null, false);
                }
                bcrypt.compare(password, user.password, function (err, result) {
                    if (result) {
                        cb(null, user);
                    } else {
                        cb(null, false);
                    }
                });
            });
        }));

    //For session handling we need to be able to serialise and deserialise users.
    // simplest is just to use the 'username' field.
    passport.serializeUser(function (user, cb) {
        cb(null, user.username);
    });

    passport.deserializeUser(function (user, cb) {
        userDAO().lookup(user, function (err, user) {
            if (err) { return cb(err); }
            cb(null, user);
        });
    });
}

exports.authorize = function (redirect) {
    return passport.authenticate('local', { failureRedirect: redirect });
};