let mongoose = require('mongoose');
let logger = require('../services/logger.js');

module.exports = app => {

	let api = {};
	let model = mongoose.model('TransactionType');
	const redisKeyList = 'transactionType:list';
	const redisKeyFindById = 'transactionType:findById:';

	api.list = (req, res) => {
		app.get('redis').get(`${redisKeyList}`, (err, transactionTypes) => {
            if (!err && transactionTypes != null) {
                logger.info(`Redis: GET ${redisKeyList}`);
                res.json(JSON.parse(transactionTypes));
            } else {
				model.find()
					.then( (transactionTypes) => {
						app.get('redis').set(`${redisKeyList}`, JSON.stringify(transactionTypes));
                        logger.info(`Redis: SET ${redisKeyList}`);
						res.json(transactionTypes);
					}, (error) => {
						logger.error(error);
						res.sendStatus(500);
					});
			}
		});
	};

	api.findById = (req, res) => {
		let id = req.params.id;
		app.get('redis').get(`${redisKeyFindById}${id}`, (err, transactionType) => {
            if (!err && transactionType != null) {
                logger.info(`Redis: GET ${redisKeyFindById}${id}`);
                res.json(JSON.parse(transactionType));
            } else {
				model.findOne({
					_id: id
				}).then( (transactionType) => {
					app.get('redis').set(`${redisKeyFindById}${id}`, JSON.stringify(transactionType));
                    logger.info(`Redis: SET ${redisKeyFindById}${id}`);
					res.json(transactionType);
				}, (error) => {
					logger.error(error);
					res.sendStatus(500);
				});
			}
		});
	};

	api.insert = (req, res) => {

		let errors = runExpressValidator(req);

		if (errors){
			logger.error('Bad request of transactionType.insert');
			res.status(400).send(errors);
			return;
		}

		model.create(req.body)
			.then( (transactionType) => {
				clearRedisKeys();
				res.json(transactionType);
			}, (error) => {
				logger.error('cannot insert transactionType');
				logger.error(error);
				res.sendStatus(500);
			});
	};

	api.update = (req, res) => {

		let errors = runExpressValidator(req);

		if (errors){
			logger.error('Bad request of transactionType.update');
			res.status(400).send(errors);
			return;
		}

		model.findByIdAndUpdate(req.params.id, req.body)
			.then( (transactionType) => {
				clearRedisKeys();
				res.json(transactionType);
			}, (error) => {
				logger.error(error);
				res.sendStatus(500);
			})
	};

	api.delete = (req, res) => {
		model.remove({ '_id': req.params.id })
			.then( () => {
				clearRedisKeys();
				res.sendStatus(200);
			}, (error) => {
				logger.error(error);
				res.sendStatus(500);
			});
	};

	let clearRedisKeys = () => {
        app.get('redis').delRedisKeys(`${redisKeyFindById}*`);
        app.get('redis').delRedisKeys(`${redisKeyList}`);
    }

	let runExpressValidator = (req) => {
		req.assert("description", "transactionType.description is required").notEmpty();
		
		return req.validationErrors();
	}

	return api;
};

