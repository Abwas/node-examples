var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username: String,
    password: String,
    OauthId: String, //for local users these will be empty
    OauthToken: String, //for local users these will be empty
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },    
    admin: {
        type: Boolean,
        default: false
    }
});

//instance method that returns full name
User.methods.getName = function() {
    return (this.firstname + ' ' + this.lastname)
};

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);