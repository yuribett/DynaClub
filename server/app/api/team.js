var mongoose = require('mongoose');

module.exports = function(app) {

	var api = {};

	var model = mongoose.model('Team');

    api.list = function(req, res) {
		
        model.find()
		.then(function(teams) {
			res.json(teams);
		}, function(error) {
			console.log(error);
			res.sendStatus(500);
		});

	};

	return api;
};

