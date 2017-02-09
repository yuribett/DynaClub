let logger = require('../app/services/logger.js');

module.exports = (server, app) => {
	let io = require('socket.io').listen(server);
	io.origins('*:*');

	io.on('connection', socket => {
		logger.info('Websocket user connected. socketID: ' + socket.id);
		app.get('redis').set('user:' + socket.handshake.query.user, socket.id);
		socket.on('disconnect', () => logger.info('Websocket user disconnected. socketID: ' + socket.id));
	});

	return io;
};