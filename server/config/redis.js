let logger = require('../app/services/logger.js');

module.exports = (port, host) => {

	let redis = require('redis');
	let client = redis.createClient(port, host);

	client.on('connect', () => { 
		console.log('Connected to Redis');
		logger.info('Connected to Redis');
	});

	return client;
};