let mongoose = require('mongoose');
let logger = require('../services/logger.js');

module.exports = app => {

	let api = {};
	let model = mongoose.model('Sprint');
	const redisKeyList = 'sprint:list';
	const redisKeyFindById = 'sprint:findById:';

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

	api.insert = (req, res) => {
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
    }

	return api;
};

