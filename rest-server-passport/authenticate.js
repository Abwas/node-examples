var passport = require('passport'); 
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('./models/user'); //model to track and store users
var config = require('./config');

//export the local strategy
exports.local = passport.use(new LocalStrategy (User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//export the facebook login strategy
exports.facebook = passport.use(new FacebookStrategy ({
    //all of these have been set up in the config file
    //when you try to authenticate with facebook the user will be redirected to facebook, then sent back with the accesstoken and fb profile for the user
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL
},
//call back function once authorized
function(accessToken, refreshToken, profile, done) {
    User.findOne({ OauthId: profile.id }, function(err,user) { //search db to see if we have a user with that profile ID already
        if (err) { //handle errors
            console.log(err); 
        }
        if (!err && user !== null) { //user exists, don't need to do anything, call done.
            done(null, user);
        } else { //create new user
            user = new User({
                username: profile.displayName
            });
            user.OauthId = profile.id;
            user.OauthToken = accessToken;
            user.save(function(err) {
                if (err) {
                    console.log(err); //handle errors
                } else {
                    console.log("Saving User...");
                    done(null, user);
                }
            });
        }
    });
}
));