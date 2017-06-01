//if (process.env.NODE_ENV !== 'production') {
//    require('@glimpse/glimpse').init();
//}

const http = require('http');
const app = require('./config/express');
const server = http.createServer(app);

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
let MONGO_URL = 'mongodb://mongodb.dynamix.com.br:27017/dynaclub';
if (process.env.MONGODB_HOST && process.env.MONGODB_PORT ) {
   MONGO_URL = 'mongodb://' + process.env.MONGODB_HOST + ':' + process.env.MONGODB_PORT + '/dynaclub'
}

///////////////////////////////////////////////////////////////////////
// redis access configuration
///////////////////////////////////////////////////////////////////////
let REDIS_SERVER = 'localhost';
let REDIS_PORT   = '6379';
if( process.env.REDIS_SERVER ) {
   REDIS_SERVER = process.env.REDIS_SERVER;
}
if( process.env.REDIS_PORT) {
   REDIS_PORT = process.env.REDIS_PORT;
}

require('./config/database')(MONGO_URL);

const redis = require('./config/redis')(REDIS_PORT, REDIS_SERVER);
app.set('redis', redis);

///////////////////////////////////////////////////////////////////////
// socket.io configuration
///////////////////////////////////////////////////////////////////////
const io = require('./config/io')(server, app);
app.set('io', io);

///////////////////////////////////////////////////////////////////////
// mailer configuration
///////////////////////////////////////////////////////////////////////
let MAILER_USER = 'dynaclub.mailer';
let MAILER_PASSWORD   = '';
if( process.env.MAILER_USER ) {
   MAILER_USER = process.env.MAILER_USER;
}
if( process.env.MAILER_PASSWORD) {
   MAILER_PASSWORD = process.env.MAILER_PASSWORD;
}
const mailer = require('./app/mailer/sender')(MAILER_USER, MAILER_PASSWORD);
app.set('mailer', mailer);

server.listen(NODE_PORT, () => {
	console.log('Server started and listening on port ' + NODE_PORT);
});