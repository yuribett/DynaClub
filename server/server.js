var http = require('http');
var app = require('./config/express');
require('./config/database')('mongodb://dynamix:dynamix@ds117839.mlab.com:17839/dynaclub');

http.createServer(app)
.listen(3000, function() {
	console.log('Server started and listening on port 3000');
});
