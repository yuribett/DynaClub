/*
var http = require('http');
let io = require('socket.io')(http);

console.log('>>> IO');

io.on('connection', (socket) => {
	console.log('user connected');

	socket.on('disconnect', function () {
		console.log('user disconnected');
	});

	socket.on('add-message', (message) => {
		io.emit('message', { type: 'new-message', text: message });
	});
});
*/
