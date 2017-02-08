let mongoose = require('mongoose');
let logger = require('../services/logger.js');

module.exports = app => {

	let api = {};

	let model = mongoose.model('TransactionType');

	api.list = (req, res) => {
		model.find()
			.then( (transactionTypes) => {
				res.json(transactionTypes);
			}, (error) => {
				logger.error(error);
				res.sendStatus(500);
			});
	};

	api.findById = (req, res) => {
		model.findOne({
			_id: req.body._id,
		}).then( (transactionType) => {
			res.json(transactionType);
		}, (error) => {
			logger.error(error);
			res.sendStatus(500);
		});
	};

	api.insert = (req, res) => {
		model.create(req.body)
			.then( (transactionType) => {
				res.json(transactionType);
			}, (error) => {
				logger.error('cannot insert transactionType');
				logger.error(error);
				res.sendStatus(500);
			});
	};

	api.update = (req, res) => {
		model.findByIdAndUpdate(req.params.id, req.body)
			.then( (transactionType) => {
				res.json(transactionType);
			}, (error) => {
				logger.error(error);
				res.sendStatus(500);
			})
	};

	api.delete = (req, res) => {
		model.remove({ '_id': req.params.id })
			.then( () => {
				res.sendStatus(200);
			}, (error) => {
				logger.error(error);
				res.sendStatus(500);
			});
	};

	return api;
};

