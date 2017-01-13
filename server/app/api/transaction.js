var mongoose = require('mongoose');

module.exports = function(app) {

	var api = {};

	var model = mongoose.model('Transaction');

    api.listByUser = function(req, res) {
		
        model.find()
		.then(function(transactions) {
			res.json(transactions);
		}, function(error) {
			console.log(error);
			res.sendStatus(500);
		});

	};
/*
    api.findById = function(req, res) {
		
	};

	api.insert = function(req, res) {
		
	};

    api.update = function(req, res) {
		
	};

    api.delete = function(req, res) {
		
	};
*/
	return api;
};

