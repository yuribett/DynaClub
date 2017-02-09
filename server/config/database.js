let logger = require('../app/services/logger.js');

module.exports = uri => {

	let mongoose = require('mongoose');

	mongoose.Promise = global.Promise;
	mongoose.connect(uri);

	mongoose.connection.on('connected', () => {
		logger.info('Connected to MongoDB');
		console.log('Connected to MongoDB');
	});

	mongoose.connection.on('error', error => {
		logger.error('Connection error: ' + error);
	});

	mongoose.connection.on('disconnected', () => {
		logger.warn('Disconnected from MongoDB');
	});

	process.on('SIGINT', () => {
		mongoose.connection.close( () => {
			logger.warn('Connection closed: app shut down');
			process.exit(0);
		});

	})
};


