var http = require('http');
var app = require('./config/express');
require('./config/database')('mongodb://mongodb.dynamix.com.br:27017/dynaclub');

http.createServer(app)
.listen(3000, function() {
	console.log('Server started and listening on port 3000');
});
