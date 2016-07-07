//exports a json object that contains certain properties
//this enables us to write our code and only have to come here to make updates

module.exports = {
    'secretKey': '12345-67890-09876-54321',
    'mongoUrl': 'mongodb://localhost:27017/conFusion',
    'facebook': {
        clientID: 'YOUR ID HERE',
        clientSecret: 'YOUR SECRET HERE',
        callbackURL: 'https://localhost:3443/users/facebook/callback'
    }
}