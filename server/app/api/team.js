let mongoose = require('mongoose');
let logger = require('../services/logger.js');

module.exports = app => {

	let api = {};
	let model = mongoose.model('Team');
	const redisKeyList = 'team:list';
	const redisKeyFindById = 'team:findById:';

	api.list =  (req, res) => {
		app.get('redis').get(`${redisKeyList}`, (err, teams) => {
            if (!err && teams != null) {
                logger.info(`Redis: GET ${redisKeyList}`);
                res.json(JSON.parse(teams));
            } else {
				model.find()
					.then( (teams) => {
						app.get('redis').set(`${redisKeyList}`, JSON.stringify(teams));
                        logger.info(`Redis: SET ${redisKeyList}`);
						res.json(teams);
					}, (error) => {
						logger.error(error);
						res.sendStatus(500);
					});
			}
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

	api.findById =  (req, res) => {

		let id = req.params.id;

		app.get('redis').get(`${redisKeyFindById}${id}`, (err, team) => {
            if (!err && team != null) {
                logger.info(`Redis: GET ${redisKeyFindById}${id}`);
                res.json(JSON.parse(team));
            } else {
				model.findOne({
					_id: id,
				}).then( (team) => {
					app.get('redis').set(`${redisKeyFindById}${id}`, JSON.stringify(team));
                    logger.info(`Redis: SET ${redisKeyFindById}${id}`);
					res.json(team);
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
			logger.error('Bad request of team.insert');
			res.status(400).send(errors);
			return;
		}

		model.create(req.body)
			.then( (team) => {
				clearRedisKeys();
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
				clearRedisKeys();
				res.json(team);
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
		req.assert("name", "team.name is required").notEmpty();
		req.assert("active", "team.active is required and must be boolean").notEmpty().isBoolean();
		return req.validationErrors();
	}

	return api;
};

