var mongoose = require('mongoose'),
    assert = require('assert');

var Dishes = require('./models/dishes-1');

//now we open the connection
var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
var db = mongoose.connection;
//once the connection is established an event will be generated
//we must react to the event
//if there is an error:
db.on('error', console.error.bind(console, 'connection error:'));
//if no error:
db.once('open', function() {
    //we're connected!
    console.log("connected correctly to the server")
    
    //now we can create a new dish
    var newDish = Dishes({
        name: 'Uthapizza',
        description: 'test'
    });
    
    //save the dish
    newDish.save(function (err) {
        if (err) throw err;
        console.log('Dish Created!');
        
        //find all the dishes
        Dishes.find({}, function (err,dishes) {
            if (err) throw err;
            //print object of all dishes
            console.log(dishes);
            
            //delete and close connection
            db.collection('dishes').drop(function () {
                db.close();
            });
        });
    });
});