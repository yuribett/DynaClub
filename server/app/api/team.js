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
			_id: req.body._id,
		}).then( (team) => {
			res.json(team);
		}, (error) => {
			logger.error(error);
			res.sendStatus(500);
		});
	};

	api.insert = (req, res) => {

		let errors = runExpressValidator(req);

		if (errors){
			logger.error('Bad request of team.insert');
			res.status(400).send(errors);
			return;
		}

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

		let errors = runExpressValidator(req);

		if (errors){
			logger.error('Bad request of team.update');
			res.status(400).send(errors);
			return;
		}

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

	let runExpressValidator = (req) => {
		req.assert("name", "team.name is required").notEmpty();
		req.assert("active", "team.active is required and must be boolean").notEmpty().isBoolean();
		
		return req.validationErrors();
	}

	return api;
};

