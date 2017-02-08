module.exports = (server, app) => {
	let io = require('socket.io').listen(server);
	io.origins('*:*');

	io.on('connection', socket => {
	
  	console.log('user connected ' + socket.id);
    console.log(socket.handshake.query.user);
    app.get('redis').set('user:'+socket.handshake.query.user, socket.id);

		socket.on('disconnect', () => console.log('user disconnected'));

	});

	return io;
};