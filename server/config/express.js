var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

app.set('secret', '3mG!pYBa8#5r1J6'); 
app.use(bodyParser.json());

//app.use(express.static('./public'));

consign({cwd: 'app'})
    .include('models')
    .then('api')
    .then('routes/auth.js')
    .then('routes')
    .into(app);

module.exports = app;
