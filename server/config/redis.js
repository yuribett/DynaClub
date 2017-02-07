module.exports = function (port, host) {

	var redis = require('redis');
	var client = redis.createClient(port, host);

	client.on('connect', function () {
		console.log('Connected to Redis');
	});

	return client;
};