var http = require('http');
var app = require('./config/express');
var server = http.createServer(app);
require('./config/database')('mongodb://mongodb.dynamix.com.br:27017/dynaclub');
require('./config/io')(server);

server.listen(3000, function () {
	console.log('Server started and listening on port 3000');
});