var http = require('http');
var app = require('./config/express');
require('./config/database')('mongodb://mongodb.dynamix.com.br:27017/dynaclub');
var server = http.createServer(app);

let io = require('socket.io').listen(server);

//app.set('io', io);
io.origins('*:*');
//io.set('transports', ['websocket', 'xhr-polling', 'jsonp-polling', 'htmlfile', 'flashsocket']);
//io.set('origins', '*:*');

io.on('connection', (socket) => {
	console.log('user connected');
	socket.on('disconnect', function () {
		console.log('user disconnected');
	});
	socket.on('add-message', (message) => {
		io.emit('message', { type: 'new-message', text: message });
	});
});

/* Redis

io.sockets.on('connection', function(socket) {

  // Promote this socket as master
  socket.on("I'm the master", function() {

    // Save the socket id to Redis so that all processes can access it.
    client.set("mastersocket", socket.id, function(err) {
      if (err) throw err;
      console.log("Master socket is now" + socket.id);
    });
  });

  socket.on("message to master", function(msg) {

    // Fetch the socket id from Redis
    client.get("mastersocket", function(err, socketId) {
      if (err) throw err;
      io.sockets.socket(socketId).emit(msg);
    });
  });

});
*/

server.listen(3000, function () {
	console.log('Server started and listening on port 3000');
});