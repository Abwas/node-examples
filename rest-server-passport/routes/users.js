var express = require('express');
var router = express.Router();

var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');

/* GET users listing. */
router.get('/', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    //find operation on Users with empty object (which returns all users in the collection as array)
    User.find({}, function (err, user) {
        //if error, end.
        if (err) throw err;
        //res.json is method that converts the object to a json string and sends it to the server
        //header set to 200 and content-type is set automatically
        res.json(user);
    });
});

//to register, the user sends a post to '/users/register'
router.post('/register', function(req,res) {
    //json object in body of post message should contain a username and password
    //body parser will parse that information and make it available on req.body
    User.register(new User({ username: req.body.username}),
                 req.body.password, function(err,user) { //this callback function returns an error, or the registered user
        if (err) {
            return res.status(500).json({err:err});
        }
        //if first and last name are available, set them.
        if (req.body.firstname) {
            user.firstname = req.body.firstname;
        }
        if (req.body.lastname) {
            user.lastname = req.body.lastname;
        }
        //save user
        user.save(function(err,user) {
        //crosscheck to make sure registration was successful
        //then have callback send 200 status code and registration successful
            passport.authenticate('local')(req,res,function() {
                return res.status(200).json({ status: 'Registration Successful'});
            });
        });
    });
});

//to login, user sends a post to '/users/login' with json object in body with username/password
router.post('/login', function(req,res,next) {
    passport.authenticate('local', function(err,user,info) {
        //inside this callback function we check to see whether the users login was successful or not
        if(err) {
            //if an error is returned, call next(err) and let the error handler take care of it
            return next(err);
        }
        if(!user) {
            //if user is null (bad user, blank user, etc.)
            //return info
            return res.status(401).json({
                err:info
            });
        }
        //at this point it appears the user is valid.
        //lets make use of passports .login function to log the user in
        req.logIn(user, function(err) {
            if (err) {
                //check for error and cancel if so
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }
            //at this point, we have a valid user
            console.log('User in users: ', user);
            //generate token for the user: provide a user, get a token returned
            var token = Verify.getToken(user);
            //return the token to the user
            res.status(200).json({
                status: 'Login successful',
                success: true,
                token: token
            });
        });
    })(req,res,next);
});

//to logout, send get request to '/users/logout'
router.get('/logout', function(req,res) {
    req.logout(); //log out
    res.status(200).json({ //return status to user
        status: 'Bye!'
    });
    //***should also destroy the token here. Needs to be added in***
});

//***FACEBOOK AUTH ROUTES***

//if user requests /facebook, call passport.authenticate with the facebook strategy
//this will result in user being sent to fb for authentication
router.get('/facebook', passport.authenticate('facebook'), function(req,res){});

//sets up our callback URL that we specified in the config.js file
router.get('/facebook/callback', function(req,res,next){
    //inside the above callback function, we call passport.auth with the facebook strategy
    passport.authenticate('facebook', function(err,user,info){
        //the above callback gets user info if successful, otherwise, an error
        if (err){ //check for error
            return next(err);
        }
        if(!user) { //no user error
            return res.status(401).json({
                err:info
            });
        }
        req.logIn(user, function(err) { //otherwise we login the user
            if (err) { //if login failed, raise error
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }
            //issue a token from the server side
            var token = Verify.getToken(user);
            
            res.status(200).json({
                status: 'Login Successful!',
                success: true,
                token: token //return the token to the user so they can use it in the future
            });
        });
    })(req, res, next);
});

module.exports = router;
