var config = require('config-lite')({});
var passport = require('passport'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
var UserModel = require('../models/users');

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme(config.jwt.scheme);
opts.secretOrKey = config.jwt.secret;

passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    UserModel.getUserByName(jwt_payload.accountName).then(function (user) {
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);

        }
    })
}));

exports = module.exports = passport;