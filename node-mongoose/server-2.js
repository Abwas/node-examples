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
    Dishes.create({
        name: 'Uthapizza',
        description: 'test'
    }, function(err,dish) {
        if (err) throw err;
        
        console.log('Dish created!');
        console.log(dish);
        //capture id of the dish to carry out a search for it
        var id = dish._id;
        
        //find dish by its id
        //use a timeout function so we can see the created and edited fields are different when printed to log
        setTimeout(function() {
            Dishes.findByIdAndUpdate(id, {
                $set: {
                    description: 'Updated Text'
                }
            }, {
                //returns updated dish
                //if we don't specify this, it returns original
                new: true
            }).exec(function(err,dish){ //executes the above code
                if (err) throw err;
                console.log('Dish updated');
                console.log(dish);
                
                db.collection('dishes').drop(function () {
                    db.close();
                });
            });
        }, 3000);
    });
});