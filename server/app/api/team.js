let mongoose = require('mongoose');
let logger = require('../services/logger.js');

module.exports = app => {

	let api = {};

	let model = mongoose.model('Team');

	api.list =  (req, res) => {
		model.find()
			.then( (teams) => {
				res.json(teams);
			}, (error) => {
				logger.error(error);
				res.sendStatus(500);
			});
	};

	api.findById =  (req, res) => {
		model.findOne({
			_id: req.params.id,
		}).then( (team) => {
			res.json(team);
		}, (error) => {
			logger.error(error);
			res.sendStatus(500);
		});
	};
	
	api.findByName =  (req, res) => {
		model.findOne({
			name: req.params.name,
		}).then( (team) => {
			res.json(team);
		}, (error) => {
			logger.error(error);
			res.sendStatus(500);
		});
	};

	api.insert = (req, res) => {
		model.create(req.body)
			.then( (team) => {
				res.json(team);
			}, (error) => {
				logger.error('cannot insert team');
				logger.error(error);
				res.sendStatus(500);
			});
	};

	api.update = (req, res) => {
		model.findByIdAndUpdate(req.params.id, req.body)
			.then( (team) => {
				res.json(team);
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

