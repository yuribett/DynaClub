var mongoose = require('mongoose');

module.exports = function(app) {

	var api = {};

	var model = mongoose.model('User');

    api.list = function(req, res) {
		
        model.find()
		.then(function(users) {
			res.json(users);
		}, function(error) {
			console.log(error);
			res.sendStatus(500);
		});

	};

	return api;
};

