let mongoose = require('mongoose');
let logger = require('../services/logger.js');

module.exports = app => {

	let dao = {};
	let model = mongoose.model('Configs');

	dao.list = () => {
		return new Promise((resolve, reject) => {
			model.find().then(configs => {
				resolve(configs);
			}, error => {
				logger.error(error);
				reject(error);
			});
		});
	};

	dao.insert = (configs) => {
		return new Promise((resolve, reject) => {
			model.create(configs).then(configs => {
				resolve(configs);
			}, error => {
				logger.error(error);
				reject(error);
			});
		});
	};

	dao.update = (configs) => {
		return new Promise((resolve, reject) => {
			model.update(configs, { new: true }).then(configs => {
				resolve(configs);
			}, error => {
				logger.error(error);
				reject(error);
			});
		});
	};

	return dao;
};

