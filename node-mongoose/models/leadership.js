//grab what we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create leaders schema
var leadersSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    abbr: {
        type: String,
        required: true
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
var Leaders = mongoose.model('Leader', leadersSchema);

//lets make it available to our node application
module.exports = Leaders;