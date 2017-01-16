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

	api.insert = function(req, res) {
		model.create(req.body)
		.then(function(configs) {
			res.json(configs);
		}, function(error) {
			console.log('cannot insert configs');
			console.log(error);
			res.sendStatus(500);
		});
	};

	api.update = function(req, res) {
		model.update(req.body)
		.then(function(configs) {
			res.json(configs);
		}, function(error) {
			console.log('cannot update configs');
			console.log(error);
			res.sendStatus(500);
		});
	};

	return api;
};

