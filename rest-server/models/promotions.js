//grab what we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Will add the Currency type to the Mongoose Schema types
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

//create promotions schema
var promotionsSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
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
    }
}, {
    timestamps: true
});

//the above schema is useless until we create a model that uses it
//lets create a model:
var Promotions = mongoose.model('Promotion', promotionsSchema);

//lets make it available to our node application
module.exports = Promotions;