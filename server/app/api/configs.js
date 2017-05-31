let logger = require('../services/logger.js');

module.exports = app => {

	let api = {};
	let dao = app.dao.configs;

	api.list = (req, res) => {
		dao.list().then(
			configs => res.json(configs),
			error => res.sendStatus(500)
		);
	};

	api.insert = (req, res) => {
		dao.insert(req.body).then(
			configs => res.json(configs),
			error => res.sendStatus(500)
		);
	};

	api.update = (req, res) => {
		dao.update(req.body).then(
			configs => res.json(configs),
			error => res.sendStatus(500)
		);
	};

	return api;
};

