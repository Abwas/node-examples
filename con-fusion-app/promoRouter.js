var express = require('express'),
    bodyParser = require('body-parser');

var promoRouter = express.Router();
promoRouter.use(bodyParser.json());
promoRouter.route('/')
.all(function(req,res,next) {
    res.writeHead(200, { 'Content-Type': 'text/plain'});
    next();
})
.get(function(req,res,next) {
    res.end('Code here will send all the promotions to you!');
})
.post(function(req,res,next) {
    res.end('Code here will add the promotions ' + req.body.name + ' with details: ' + req.body.description);
})
.delete(function(req,res,next) {
    res.end('Code here will delete all promotions');
});

promoRouter.route('/:promoId')
.all(function(req,res,next) {
    res.writeHead(200, { 'Content-Type': 'text/plain'});
    next();
})
.get(function(req,res,next) {
    res.end('Code here will send details of the promotion: ' + req.params.promoId + ' to you!');
})
.put(function(req,res,next) {
    res.write('Code here updating the promotion: ' + req.params.promoId + '\n');
    res.end('Code here will update the promotion: ' + req.body.name + ' with details: ' + req.body.description);
})
.delete(function(req,res,next) {
    res.end('Code here deleting promotion: ' + req.params.promoId);
});

module.exports = promoRouter;