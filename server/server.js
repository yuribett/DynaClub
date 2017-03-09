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
if (process.env.MONGODB_HOST && process.env.MONGODB_PORT ) {
   MONGO_URL = 'mongodb://' + process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT + '/dynaclub'
}

///////////////////////////////////////////////////////////////////////
// mongodb access configuation
///////////////////////////////////////////////////////////////////////
var JIRA_URL = 'http://jira-host';
if (process.env.JIRA_URL) {
    JIRA_URL = process.env.JIRA_URL;
}

var JIRA_APP_CALLBACK_HOST = 'http://localhost:' + NODE_PORT;
if (process.env.JIRA_APP_CALLBACK_HOST) {
    JIRA_APP_CALLBACK_HOST = process.env.JIRA_APP_CALLBACK_HOST;
}

var JIRA_CONSUMER_KEY;
if (process.env.JIRA_CONSUMER_KEY) {
    JIRA_CONSUMER_KEY = process.env.JIRA_CONSUMER_KEY;
}

var JIRA_CERTIFICATE;
if (process.env.JIRA_CERTIFICATE) {
    JIRA_CERTIFICATE = process.env.JIRA_CERTIFICATE;
}

var jira = require('./config/jira')(JIRA_URL, JIRA_APP_CALLBACK_HOST, JIRA_CONSUMER_KEY, JIRA_CERTIFICATE);
app.set('jira', jira);

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