var User = require('../models/user');
var jwt = require('jsonwebtoken'); //used to create, sign, verify tokens
var config = require('../config.js');
var User = require('../models/user');

//when a user has been verified in the login function in users.js, this is called
exports.getToken = function(user) {
    //call jsonwebtoken to generate and sign a webtoken for the user
    //use our secretKey in config.js
    return jwt.sign(user, config.secretKey, {
        expiresIn: 3600 //token is valid for 3600 seconds (One hour)
    });
};

exports.verifyOrdinaryUser = function (req,res,next) {
    //check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    //if token is found, decode token
    if (token) {
        //verifies secret code and checks if expired
        jwt.verify(token, config.secretKey, function(err,decoded) {
            //callback function takes the token and checks it
            if(err) {
                var err = new Error('You are not authenticated');
                err.status = 401;
                return next(err);
            } else {
                //if everything is good, save the payload/contents to req.decoded (username/password)
                req.decoded = decoded;
                next();
            }
        });
    } else {
        //the token was not found, so return an error
        var err = new Error('No token provided');
        err.status = 403;
        return next(err);
    }
};