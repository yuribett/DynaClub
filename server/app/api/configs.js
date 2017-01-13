var mongoose = require('mongoose');

module.exports = function(app) {

	var api = {};

	var model = mongoose.model('Configs');

    api.list = function(req, res) {
		
        model.find()
		.then(function(configs) {
			res.json(configs);
		}, function(error) {
			console.log(error);
			res.sendStatus(500);
		});

	};

	return api;
};

