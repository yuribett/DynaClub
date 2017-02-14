let mongoose = require('mongoose');
let logger = require('../services/logger.js');

module.exports = app => {

	let api = {};
	let model = mongoose.model('Sprint');
	const redisKeyList = 'sprint:list';
	const redisKeyFindById = 'sprint:findById:';
	const redisKeyFindCurrent = 'sprint:findCurrent';

	api.list = (req, res) => {
		app.get('redis').get(`${redisKeyList}`, (err, doc) => {
            if (!err && doc != null) {
                logger.info(`Redis: GET ${redisKeyList}`);
                res.json(JSON.parse(doc));
            } else {
				model.find()
					.then( (doc) => {
						app.get('redis').set(`${redisKeyList}`, JSON.stringify(doc));
                        logger.info(`Redis: SET ${redisKeyList}`);
						res.json(doc);
					}, (error) => {
						logger.error(error);
						res.sendStatus(500);
					});
			}
		});
	};

	api.findById = (req, res) => {
		let id = req.params.id;

		app.get('redis').get(`${redisKeyFindById}${id}`, (err, doc) => {
            if (!err && doc != null) {
                logger.info(`Redis: GET ${redisKeyFindById}${id}`);
                res.json(JSON.parse(doc));
            } else {
				model.findOne({
					_id: id,
				}).then( (doc) => {
					app.get('redis').set(`${redisKeyFindById}${id}`, JSON.stringify(doc));
                    logger.info(`Redis: SET ${redisKeyFindById}${id}`);
					res.json(doc);
				}, (error) => {
					logger.error(error);
					res.sendStatus(500);
				});
			}
		});
	};

	api.findCurrent = (req, res) => {
		let currentDate = new Date();

		app.get('redis').get(`${redisKeyFindCurrent}`, (err, doc) => {
            if (!err && doc != null) {
                logger.info(`Redis: GET ${redisKeyFindCurrent}`);
                res.json(JSON.parse(doc));
            } else {
				model.findOne({
					$and: [
                        { 'dateStart' : {"$lt": currentDate} },
                        { 'dateFinish' : {"$gte": currentDate} }
                    ]
				}).then( (doc) => {
					app.get('redis').set(`${redisKeyFindCurrent}`, JSON.stringify(doc));
					app.get('redis').expire(`${redisKeyFindCurrent}`, 18000); //expires in 5 hours
                    logger.info(`Redis: SET ${redisKeyFindCurrent}`);
					res.json(doc);
				}, (error) => {
					logger.error(error);
					res.sendStatus(500);
				});
			}
		});
	};

	/**
	 * TODO for ranking
	 */
	api.findLast = (req, res) => {
		res.json(null);
	}

	api.insert = (req, res) => {
		let errors = runExpressValidator(req);
		if (errors){
			logger.error('Bad request of sprint.insert');
			res.status(400).send(errors);
			return;
		}

		model.create(req.body)
			.then( (doc) => {
				clearRedisKeys();
				res.json(doc);
			}, (error) => {
				logger.error(error);
				res.sendStatus(500);
			});
	};

	api.update = (req, res) => {
		let errors = runExpressValidator(req);
		if (errors){
			logger.error('Bad request of sprint.update');
			res.status(400).send(errors);
			return;
		}

		model.findByIdAndUpdate(req.params.id, req.body)
			.then( (doc) => {
				clearRedisKeys();
				res.json(doc);
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
		app.get('redis').delRedisKeys(`${redisKeyFindCurrent}`);
    }

	let runExpressValidator = (req) => {
		req.assert("dateStart", "sprint.dateStart is required and must be a date").notEmpty().isDate();
		req.assert("dateFinish", "sprint.dateFinish is required and must be a date").notEmpty().isDate();
		req.assert("initialAmount", "sprint.initialAmount is required and must be numeric").notEmpty().isNumeric();
		return req.validationErrors();
	}

	return api;
};

