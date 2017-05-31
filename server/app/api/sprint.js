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
                    .sort({ dateStart: -1 })
                    .then((doc) => {
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

    api.findIntersected = (req, res) => {
        let date = req.params.date;
        model.find()
            .where('dateStart').lte(date)
            .where('dateFinish').gte(date)
            .sort({ dateStart: -1 })
            .then((doc) => {
                res.json(doc);
            }, (error) => {
                logger.error(error);
                res.sendStatus(500);
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
                }).then((doc) => {
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

    api.findSprintByDate = (currentDate) => {
        return new Promise((resolve, reject) => {
            app.get('redis').get(`${redisKeyFindCurrent}`, (err, doc) => {
                if (!err && doc != null) {
                    logger.info(`Redis: GET ${redisKeyFindCurrent}`);
                    resolve(JSON.parse(doc));
                } else {
                    model.findOne({
                        $and: [
                            { 'dateStart': { "$lte": currentDate } },
                            { 'dateFinish': { "$gte": currentDate } }
                        ]
                    }).then(doc => {
                        app.get('redis').set(`${redisKeyFindCurrent}`, JSON.stringify(doc));
                        app.get('redis').expire(`${redisKeyFindCurrent}`, 18000); //expires in 5 hours
                        logger.info(`Redis: SET ${redisKeyFindCurrent}`);
                        resolve(doc);
                    }, error => {
                        logger.error(error);
                        reject(error);
                    });
                }
            });
        });
    }

    api.findCurrent = (req, res) => {
        let currentDate = new Date();

        api.findSprintByDate(currentDate).then(
            sprint => {
                res.json(doc);
            },
            error => {
                res.sendStatus(500);
            }
        );
    };

    api.findLast = (req, res) => {
        const lastMonhDate = new Date();
        lastMonhDate.setMonth(lastMonhDate.getMonth() - 1);
        api.findSprintByDate(lastMonhDate).then(
            sprint => {
                res.json(sprint);
            },
            error => {
                res.sendStatus(500);
            }
        );
    }

    api.insert = (req, res) => {
        let errors = runExpressValidator(req);
        if (errors) {
            logger.error('Bad request of sprint.insert');
            res.status(400).send(errors);
            return;
        }

        model.create(req.body)
            .then((doc) => {
                clearRedisKeys();
                res.json(doc);
            }, (error) => {
                logger.error(error);
                res.sendStatus(500);
            });
    };

    api.update = (req, res) => {
        let errors = runExpressValidator(req);
        if (errors) {
            logger.error('Bad request of sprint.update');
            res.status(400).send(errors);
            return;
        }

        model.findByIdAndUpdate(req.params.id, req.body)
            .then((doc) => {
                clearRedisKeys();
                res.json(doc);
            }, (error) => {
                logger.error(error);
                res.sendStatus(500);
            })
    };

    api.delete = (req, res) => {
        model.remove({ '_id': req.params.id })
            .then(() => {
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