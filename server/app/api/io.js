var http = require('http');
let io = require('socket.io')(http);

module.exports = function (app) {

	var api = {};

	api.ioTransaction = function (req, res) {
		console.log('bateu aqui na rota');

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

	return api;
};

