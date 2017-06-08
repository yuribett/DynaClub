let mongoose = require('mongoose');
let logger = require('../services/logger.js');

module.exports = app => {

    let dao = {};
    let model = mongoose.model('Team');
    const redisKeyList = 'team:list';
    const redisKeyFindById = 'team:findById:';

    dao.list = (req, res) => {
        return new Promise((resolve, reject) => {
            app.get('redis').get(`${redisKeyList}`, (err, teams) => {
                if (!err && teams != null) {
                    logger.info(`Redis: GET ${redisKeyList}`);
                    resolve(JSON.parse(teams));
                } else {
                    model.find().sort({ name: 1 }).then(teams => {
                        app.get('redis').set(`${redisKeyList}`, JSON.stringify(teams));
                        logger.info(`Redis: SET ${redisKeyList}`);
                        resolve(teams);
                    }, error => {
                        logger.error(error);
                        reject(error);
                    });
                }
            });
        });
    };

    dao.findByName = (name) => {
        return new Promise((resolve, reject) => {
            model.findOne({
                name: name,
            }).then(team => {
                resolve(team);
            }, error => {
                logger.error(error);
                reject(error);
            });
        });
    };

    dao.findById = (id) => {
        return new Promise((resolve, reject) => {
            app.get('redis').get(`${redisKeyFindById}${id}`, (err, team) => {
                if (!err && team != null) {
                    logger.info(`Redis: GET ${redisKeyFindById}${id}`);
                    resolve(JSON.parse(team));
                } else {
                    model.findOne({
                        _id: id,
                    }).then((team) => {
                        app.get('redis').set(`${redisKeyFindById}${id}`, JSON.stringify(team));
                        logger.info(`Redis: SET ${redisKeyFindById}${id}`);
                        resolve(team);
                    }, (error) => {
                        logger.error(error);
                        reject(error);
                    });
                }
            });
        });
    };

    dao.insert = (team) => {
        return new Promise((resolve, reject) => {
            model.create(team).then(team => {
                clearRedisKeys();
                resolve(team);
            }, error => {
                logger.error('cannot insert team');
                logger.error(error);
                reject(error);
            });
        });
    };

    dao.update = (id, team) => {
        return new Promise((resolve, reject) => {
            model.findByIdAndUpdate(id, team, { new: true }).then(team => {
                clearRedisKeys();
                resolve(team);
            }, error => {
                logger.error(error);
                reject(error);
            });
        });
    };

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
    }

    return dao;
};