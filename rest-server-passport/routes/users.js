var express = require('express');
var router = express.Router();

var passport = require('passport');
var User = require('../models/user');
var Verify = require('./verify');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
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
        //crosscheck to make sure registration was successful
        //then have callback send 200 status code and registration successful
        passport.authenticate('local')(req,res,function() {
            return res.status(200).json({ status: 'Registration Successful'});
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


module.exports = router;
