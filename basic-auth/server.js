// You can perform AUTH on the entire app, on specific routes, specific URIs, etc.
// In this case we will preform Authentication on the app itself

var express = require('express'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser');

var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));
//if the client sends a cookie in the header, it will be parsed and made available as a JS object property on the req object
app.use(cookieParser('12345-67890-09876-54321')); //use cookie Parser and set secret key

function auth (req, res, next) {
    console.log(req.headers);
    
    //check to see if incoming request has a signed cookie with a user property.
    //if it doesn't exist, the user has not been verified so they must type in username/password
    if(!req.signedCookies.user) {
        //extract authorization property from request header
        //if client sends a username/pass, this is where it will be
        var authHeader = req.headers.authorization;
        //check to make sure authHeader is not null
        //if it is null, no authorization came in so the request is not acceptable
        if (!authHeader) {
            var err = new Error('You are not authenticated');
            err.status = 401; //auth failed http error code
            next(err); //only the function that takes this error will be triggered. All others bypassed
            return;
        }

        //else, a username/pass was sent and we need to extract it
        //splits auth header into two items, we want to unencode the 2nd part. Then split.
        var auth = new Buffer(authHeader.split(' ')[1],'base64').toString().split(':');
        //now we can assign user and pass to our split:
        var user = auth[0];
        var pass = auth[1];
        //now we compare against the hardcoded user/pass in the server.js file:
        if(user == 'admin' && pass == 'password') { //authorized! 
            //set up our signed cookie and supply username and password
            //res.cookie takes 3 parameters: name of the cookie, value of the cookie, additional options
            res.cookie('user', 'admin', {signed:true});
            next(); //The client is now passed to the next middleware
        } else { //wrong user/pass. Error out
            var err = new Error('Wrong username/password');
            err.status = 401;
            next(err);
        }
    } else { //if the cookie is included in the header, it means were authenticated already - so we jump here
        if (req.signedCookies.user == 'admin') { //check if username adds up. If so, we have a validated user.
            console.log(req.signedCookies);
            next();
        } else { //username doesn't match. Error
            var err = new Error('You are not authenticated');
            err.status = 401;
            next(err);
        }
    }
}
    
//use the auth function
app.use(auth);

app.use(express.static(__dirname + '/public'));

//middleware function for auth error handling
//if next(err) is called, it drops into this function
app.use(function(err,req,res,next) {
    res.writeHead(err.status || 500, {
        'WWW-Authenticate': 'Basic',
        'Content-Type': 'text/plain'
    });
    res.end(err.message);
});

app.listen(port, hostname, function() {
    console.log(`Server is running at http://${hostname}:${port}/`);
})