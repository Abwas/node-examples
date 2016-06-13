var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser');

var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());

app.all('/dishes', function(req,res,next) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    next();
});

app.get('/dishes', function(req,res,next) {
    res.end('Code here will send all the dishes to you');
});

app.post('/dishes', function(req,res,next) {
    res.end('Code here will add the dish ' + req.body.name + ' with details: ' + req.body.description);
});

app.delete('/dishes', function(req,res,next) {
    res.end('Code here will delete all dishes');
});

app.get('/dishes/:dishId', function(req,res,next) {
    res.end('Code here will send details of the dish: ' + req.params.dishId + ' to you!');
});

app.put('/dishes/:dishId', function(req,res,next) {
    res.write('Code here updating the dish: ' + req.params.dishId + '\n');
    res.end('Code here will update the dish: ' + req.body.name + ' with details: ' + req.body.description);
});

app.delete('/dishes/:dishId', function(req,res,next){
    res.end('Code deleting the dish: ' + req.params.dishId);
});

app.use(express.static(__dirname + '/public'));

app.listen(port, hostname, function() {
    console.log(`Server is running at http://${hostname}:${port}/`);
})