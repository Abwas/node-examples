//grab what we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create comment scema
var commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

//create dish schema
var dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    //adding the comment schema into dishes schema
    comments: [commentSchema]
}, {
    timestamps: true
});

//the above schema is useless until we create a model that uses it
//lets create a model:
var Dishes = mongoose.model('Dish', dishSchema);

//lets make it available to our node application
module.exports = Dishes;