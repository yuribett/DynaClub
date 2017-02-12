var http = require('http');
var app = require('./config/express');
var server = http.createServer(app);

///////////////////////////////////////////////////////////////////////
// Node server configuation
///////////////////////////////////////////////////////////////////////
NODE_PORT = 3000
if( process.env.NODE_PORT) {
   NODE_PORT = process.env.NODE_PORT;
}

///////////////////////////////////////////////////////////////////////
// mongodb access configuation
///////////////////////////////////////////////////////////////////////
var MONGO_URL = 'mongodb://mongodb.dynamix.com.br:27017/dynaclub';
MONGO_URL = 'mongodb://dyna:dyna@ds117839.mlab.com:17839/dynaclub';
if (process.env.MONGODB_HOST && process.env.MONGODB_PORT ) {
   MONGO_URL = 'mongodb://' + process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT + '/dynaclub'
}

///////////////////////////////////////////////////////////////////////
// redis access configuration
///////////////////////////////////////////////////////////////////////
var REDIS_SERVER = 'localhost';
var REDIS_PORT   = '6379';
if( process.env.REDIS_SERVER ) {
   REDIS_SERVER = process.env.REDIS_SERVER;
}
if( process.env.REDIS_PORT) {
   REDIS_PORT = process.env.REDIS_PORT;
}

require('./config/database')(MONGO_URL);

var redis = require('./config/redis')(REDIS_PORT, REDIS_SERVER);
app.set('redis', redis);

var io = require('./config/io')(server, app);
app.set('io', io);

server.listen(NODE_PORT, function () {
	console.log('Server started and listening on port ' + NODE_PORT);
});