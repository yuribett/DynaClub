let mongoose = require('mongoose');
let logger = require('../services/logger.js');

module.exports = app => {

    let dao = {};
    let model = mongoose.model('Sprint');
    const redisKeyList = 'sprint:list';
    const redisKeyFindById = 'sprint:findById:';
    const redisKeyFindCurrent = 'sprint:findCurrent';

    dao.list = () => {
        return new Promise((resolve, reject) => {
            app.get('redis').get(`${redisKeyList}`, (err, doc) => {
                if (!err && doc != null) {
                    logger.info(`Redis: GET ${redisKeyList}`);
                    resolve(JSON.parse(doc));
                } else {
                    model.find().sort({ dateStart: -1 }).then(sprints => {
                        app.get('redis').set(`${redisKeyList}`, JSON.stringify(sprints));
                        logger.info(`Redis: SET ${redisKeyList}`);
                        resolve(sprints);
                    }, error => {
                        logger.error(error);
                        reject(error);
                    });
                }
            });
        });
    };

    dao.findIntersected = (date) => {
        return new Promise((resolve, reject) => {
            model.find()
                .where('dateStart').lte(date)
                .where('dateFinish').gte(date)
                .sort({ dateStart: -1 })
                .then(sprint => {
                    resolve(sprint);
                }, error => {
                    logger.error(error);
                    reject(error);
                });
        });
    };

    dao.findById = (id) => {
        return new Promise((resolve, reject) => {
            app.get('redis').get(`${redisKeyFindById}${id}`, (err, doc) => {
                if (!err && doc != null) {
                    logger.info(`Redis: GET ${redisKeyFindById}${id}`);
                    res.json(JSON.parse(doc));
                } else {
                    model.findOne({
                        _id: id,
                    }).then(sprint => {
                        app.get('redis').set(`${redisKeyFindById}${id}`, JSON.stringify(sprint));
                        logger.info(`Redis: SET ${redisKeyFindById}${id}`);
                        resolve(sprint);
                    }, error => {
                        logger.error(error);
                        reject(error);
                    });
                }
            });
        });
    };

    dao.findSprintByDate = (currentDate) => {
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
                    }).then(sprint => {
                        app.get('redis').set(`${redisKeyFindCurrent}`, JSON.stringify(sprint));
                        app.get('redis').expire(`${redisKeyFindCurrent}`, 18000); //expires in 5 hours
                        logger.info(`Redis: SET ${redisKeyFindCurrent}`);
                        resolve(sprint);
                    }, error => {
                        logger.error(error);
                        reject(error);
                    });
                }
            });
        });
    }

    dao.findCurrent = () => {
        let currentDate = new Date();
        return dao.findSprintByDate(currentDate);
    };

    dao.findLast = () => {
        var lastMonhDate = new Date();
        lastMonhDate.setMonth(lastMonhDate.getMonth() - 1);
        return dao.findSprintByDate(lastMonhDate);
    }

    dao.insert = (sprint) => {
        return new Promise((resolve, reject) => {
            model.create(sprint).then(sprint => {
                clearRedisKeys();
                resolve(sprint);
            }, error => {
                logger.error(error);
                reject(500);
            });
        });
    };

    dao.update = (id, sprint) => {
        return new Promise((resolve, reject) => {
            model.findByIdAndUpdate(id, sprint, { new: true }).then(sprint => {
                clearRedisKeys();
                resolve(sprint);
            }, error => {
                logger.error(error);
                reject(500);
            });
        });
    };

    //return new Promise((resolve, reject) => {
    dao.delete = (id) => {
        return new Promise((resolve, reject) => {
            model.remove({ '_id': id }).then(() => {
                clearRedisKeys();
                resolve();
            }, error => {
                logger.error(error);
                reject(error);
            });
        });
    };

    let clearRedisKeys = () => {
        app.get('redis').delRedisKeys(`${redisKeyFindById}*`);
        app.get('redis').delRedisKeys(`${redisKeyList}`);
        app.get('redis').delRedisKeys(`${redisKeyFindCurrent}`);
    }

    return dao;
};