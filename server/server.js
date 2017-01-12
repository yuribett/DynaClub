var http = require('http');
var app = require('./config/express');
require('./config/database')('mongodb://localhost/dynaclub');

http.createServer(app)
.listen(3000, function() {
	console.log('Server started and listening on port 3000');
});
