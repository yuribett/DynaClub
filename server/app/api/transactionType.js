var mongoose = require('mongoose');

module.exports = function (app) {

	var api = {};

	var model = mongoose.model('TransactionType');

	api.list = function (req, res) {
		model.find()
			.then(function (transactionTypes) {
				res.json(transactionTypes);
			}, function (error) {
				console.log(error);
				res.sendStatus(500);
			});
	};

	api.findById = function (req, res) {
		model.findOne({
			_id: req.body._id,
		}).then(function (transactionType) {
			res.json(transactionType);
		}, function (error) {
			console.log(error);
			res.sendStatus(500);
		});
	};

	api.insert = function (req, res) {
		model.create(req.body)
			.then(function (transactionType) {
				res.json(transactionType);
			}, function (error) {
				console.log('cannot insert transactionType');
				console.log(error);
				res.sendStatus(500);
			});
	};

	api.update = function (req, res) {
		model.findByIdAndUpdate(req.params.id, req.body)
			.then(function (transactionType) {
				res.json(transactionType);
			}, function (error) {
				console.log(error);
				res.sendStatus(500);
			})
	};

	api.delete = function (req, res) {
		model.remove({ '_id': req.params.id })
			.then(function () {
				res.sendStatus(200);
			}, function (error) {
				console.log(error);
				res.sendStatus(500);
			});
	};

	return api;
};

