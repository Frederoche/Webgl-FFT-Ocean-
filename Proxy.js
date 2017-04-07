var express = require('express');
var app = express();
var http = require('http');
var url = require('url');
var fs = require('fs');

var router = express.Router();

app.use(express.static('Client'));

app.get('/image/phillipsSpectrum.jpg', function(req, res) {
    var url = req.originalUrl;

    console.log(url);

    var img = fs.readFileSync('./image/phillipsSpectrum.jpg');
    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    res.end(img, 'binary');

});

app.use('*', function(req, res) {
    res.send('index.html')
});

app.listen(8000);
console.log("listen To port 8000");