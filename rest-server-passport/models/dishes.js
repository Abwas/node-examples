//grab what we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Will add the Currency type to the Mongoose Schema types
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

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
    //whenever a user inserts a comment, we will track which user did that.
    //This allows us to ensure deletions/edits to comments are only available to the users that created the comment
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true
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