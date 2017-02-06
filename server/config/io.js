module.exports = function (server) {
	let io = require('socket.io').listen(server);

	io.origins('*:*');

	io.on('connection', (socket) => {
		console.log('user connected');
		socket.on('disconnect', function () {
			console.log('user disconnected');
		});
		socket.on('add-message', (message) => {
			io.emit('message', { type: 'new-message', text: message });
		});
	});
	
};



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