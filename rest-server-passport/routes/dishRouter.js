var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');
//require the schema
var Dishes = require('../models/dishes');

var Verify = require('./verify');

var dishRouter = express.Router();
dishRouter.use(bodyParser.json());

//handling the dishes collection
dishRouter.route('/')

//when we receive a request for 'get' on '/'
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    //find operation on Dishes with empty object (which returns all items in Dishes collection as array)
    Dishes.find({})
        //populate the dishes with the comment information
        .populate('comments.postedBy')
        .exec(function (err,dish){
        //if error, end.
        if (err) throw err;
        //res.json is method that converts the object to a json string and sends it to the server
        //header set to 200 and content-type is set automatically
        res.json(dish);
    });
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    //remember, req.body has already been passed by the body parser and converted into the appropriate json
    Dishes.create(req.body, function (err, dish) {
        if (err) throw err;
        console.log('Dish created!');
        var id = dish._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        //send a response to client with the id of the dish that has been inserted
        res.end('Added the dish with id: ' + id);
    });
})
//delete dishes in the collection
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    //empty object as first parameter to delete all dishes
    Dishes.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

//handling specific dishes
dishRouter.route('/:dishId')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    //req.params.dishId holds the dish id
    Dishes.findById(req.params.dishId)
        .populate('comments.postedBy') //add in details of comments
        .exec(function (err, dish) {
        if (err) throw err;
        res.json(dish);
    });
})
.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        //expectation is that the body of incoming message should contain updates in json format
        $set: req.body
    }, {
        //callback function will return the updated dish value
        new: true
    }, function (err, dish) {
        if (err) throw err;
        //return updated dish back to client
        res.json(dish);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    Dishes.findByIdAndRemove(req.params.dishId, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

//NOW WE HANDLE THE COMMENTS
//Each dish has its own specific comments
dishRouter.route('/:dishId/comments')
.all(Verify.verifyOrdinaryUser)
.get(function (req, res, next) {
    //return all comments for a dish in an array
    Dishes.findById(req.params.dishId)
        .populate('comments.postedBy')
        .exec(function (err, dish) {
        if (err) throw err;
        res.json(dish.comments); //dish.comments already points to the array of all the comments so we just return that in json format
    });
})
.post(function (req, res, next) {
    //first, retrieve the dish we want to add comments to
    Dishes.findById(req.params.dishId, function (err, dish) {
        if (err) throw err;
        //records the id of the user into the postedBy property (so we know who is making a comment)
        req.body.postedBy = req.decoded._doc._id;
        //then push the incoming comment (req.body) into the dish.comments array
        dish.comments.push(req.body);
        //then we save the new array
        dish.save(function(err,dish) {
            if (err) throw err;
            console.log('Updated Comments');
            //return dish
            res.json(dish);
        });
    });
})

.delete(Verify.verifyAdmin, function (req, res, next) {
    //delete all the comments for one dish
    //first, we find the dish with findbyid
    Dishes.findById(req.params.dishId, function (err, dish) {
        if (err) throw err;
        
        //remove does not support an entire array. So we then create a for loop to loop through the array and delete each comment individually
        for (var i = (dish.comments.length - 1); i >= 0; i--) {
            dish.comments.id(dish.comments[i]._id).remove();
        }
        //once deleted, we save the new dish
        dish.save(function (err, result) {
            if (err) throw err;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            //finally, return a message
            res.end('Deleted all comments!');
        });
    });
});

dishRouter.route('/:dishId/comments/:commentId')
.all(Verify.verifyOrdinaryUser)
.get(function (req, res, next) {
    //first retrieve the correct dish
    Dishes.findById(req.params.dishId)
        .populate('comments.postedBy')
        .exec(function (err, dish) {
        if (err) throw err;
        //then return the exact comment from the array of comments
        res.json(dish.comments.id(req.params.commentId));
    });
})

.put(function (req, res, next) {
    //support for put in embedded documents is not as straight forward
    //entire updated comment must be sent. We then delete the old comment, and insert the update as an entirely new comment
    Dishes.findById(req.params.dishId, function (err, dish) {
        if (err) throw err;
        dish.comments.id(req.params.commentId).remove();
        req.body.postedBy = req.decoded._doc._id;
        dish.comments.push(req.body);
        dish.save(function (err, dish) {
            if (err) throw err;
            console.log('Updated Comments!');
            res.json(dish);
        });
    });
})

.delete(function (req, res, next) {
    Dishes.findById(req.params.dishId, function (err, dish) {
        //check to see if the user that is deleting the comment is the same user that created the comment
        if(dish.comments.id(req.params.commentId).postedBy != req.decoded._doc._id) {
            var error = new Error('You are not authorized to perform this operation');
            err.status = 403;
            return next(err);
        }
        
        dish.comments.id(req.params.commentId).remove();
        dish.save(function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });
});

module.exports = dishRouter;


