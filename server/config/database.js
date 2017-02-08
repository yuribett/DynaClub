module.exports = uri => {

	let mongoose = require('mongoose');

	mongoose.Promise = global.Promise;
	mongoose.connect(uri);

	mongoose.connection.on('connected', () => {
		console.log('Connected to MongoDB')
	});

	mongoose.connection.on('error', error => {
		console.log('Connection error: ' + error);
	});

	mongoose.connection.on('disconnected', () => {
		console.log('Disconnected from MongoDB')
	});

	process.on('SIGINT', () => {
		mongoose.connection.close( () => {
			console.log('Connection closed: app shut down');
			process.exit(0);
		});

	})
};


