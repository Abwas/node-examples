//grab what we need
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//create our first schema
var dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

//the above schema is useless until we create a model that uses it
//lets create a model:
var Dishes = mongoose.model('Dish', dishSchema);

//lets make it available to our node application
module.exports = Dishes;