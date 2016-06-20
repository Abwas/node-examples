var express = require('express'),
    bodyParser = require('body-parser');

var leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());
leaderRouter.route('/')
.all(function(req,res,next) {
    res.writeHead(200, { 'Content-Type': 'text/plain'});
    next();
})
.get(function(req,res,next) {
    res.end('Code here will send all the leaders to you!');
})
.post(function(req,res,next) {
    res.end('Code here will add the leaders ' + req.body.name + ' with details: ' + req.body.description);
})
.delete(function(req,res,next) {
    res.end('Code here will delete all leaders');
});

leaderRouter.route('/:leaderId')
.all(function(req,res,next) {
    res.writeHead(200, { 'Content-Type': 'text/plain'});
    next();
})
.get(function(req,res,next) {
    res.end('Code here will send details of the leader: ' + req.params.leaderId + ' to you!');
})
.put(function(req,res,next) {
    res.write('Code here updating the leader: ' + req.params.leaderId + '\n');
    res.end('Code here will update the leader: ' + req.body.name + ' with details: ' + req.body.description);
})
.delete(function(req,res,next) {
    res.end('Code here deleting leader: ' + req.params.leaderId);
});

module.exports = leaderRouter;