var http = require('http');
var app = require('./config/express');
var server = http.createServer(app);

require('./config/database')('mongodb://mongodb.dynamix.com.br:27017/dynaclub');

var redis = require('./config/redis')('6379', 'localhost');
app.set('redis', redis);

var io = require('./config/io')(server, app);
app.set('io', io);

server.listen(3000, function () {
	console.log('Server started and listening on port 3000');
});