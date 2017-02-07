module.exports = function (uri) {

	var mongoose = require('mongoose');

	mongoose.Promise = global.Promise;
	mongoose.connect(uri);

	mongoose.connection.on('connected', function () {
		console.log('Connected to MongoDB')
	});

	mongoose.connection.on('error', function (error) {
		console.log('Connection error: ' + error);
	});

	mongoose.connection.on('disconnected', function () {
		console.log('Disconnected from MongoDB')
	});

	process.on('SIGINT', function () {
		mongoose.connection.close(function () {
			console.log('Connection closed: app shut down');
			process.exit(0);
		});

	})
};


