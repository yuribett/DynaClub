var http = require('http');
var app = require('./config/express');
require('./config/database')('mongodb://dyna:dyna@ds117839.mlab.com:17839/dynaclub');

let io = require('socket.io')(http);

io.on('connection', (socket) => {
	console.log('user connected');

	socket.on('disconnect', function () {
		console.log('user disconnected');
	});

	socket.on('add-message', (message) => {
		io.emit('message', { type: 'new-message', text: message });
	});
});



http.createServer(app)
	.listen(3000, function () {
		console.log('Server started and listening on port 3000');
	});
