let mongoose = require('mongoose');
let logger = require('../services/logger.js');

module.exports = app => {

	let api = {};

	let model = mongoose.model('Configs');

	api.list = (req, res) => {
		model.find()
			.then( (configs) => {
				res.json(configs);
			}, (error) => {
				logger.error(error);
				res.sendStatus(500);
			});
	};

	api.insert = (req, res) => {
		model.create(req.body)
			.then( (configs) => {
				res.json(configs);
			}, (error) => {
				logger.error('cannot insert configs');
				logger.error(error);
				res.sendStatus(500);
			});
	};

	api.update = (req, res) => {
		model.update(req.body)
			.then( (configs) => {
				res.json(configs);
			}, (error) => {
				logger.error('cannot update configs');
				logger.error(error);
				res.sendStatus(500);
			});
	};

	return api;
};

