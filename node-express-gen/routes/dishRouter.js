var express = require('express'),
    bodyParser = require('body-parser');

var dishRouter = express.Router();
dishRouter.use(bodyParser.json());
dishRouter.route('/')
.all(function(req,res,next) {
    res.writeHead(200, { 'Content-Type': 'text/plain'});
    next();
})
.get(function(req,res,next) {
    res.end('Code here will send all the dishes to you!');
})
.post(function(req,res,next) {
    res.end('Code here will add the dish ' + req.body.name + ' with details: ' + req.body.description);
})
.delete(function(req,res,next) {
    res.end('Code here will delete all dishes');
});

dishRouter.route('/:dishId')
.all(function(req,res,next) {
    res.writeHead(200, { 'Content-Type': 'text/plain'});
    next();
})
.get(function(req,res,next) {
    res.end('Code here will send details of the dish: ' + req.params.dishId + ' to you!');
})
.put(function(req,res,next) {
    res.write('Code here updating the dish: ' + req.params.dishId + '\n');
    res.end('Code here will update the dish: ' + req.body.name + ' with details: ' + req.body.description);
})
.delete(function(req,res,next) {
    res.end('Code here deleting dish: ' + req.params.dishId);
});

module.exports = dishRouter;