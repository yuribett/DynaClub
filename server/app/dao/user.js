let mongoose = require('mongoose');
let logger = require('../services/logger.js');

module.exports = app => {

    let dao = {};
    let model = mongoose.model('User');
    const redisKeyFindByTeam = 'user:findByTeam:';
    const redisKeyList = 'user:list';
    const redisKeyFindById = 'user:findById:';

    dao.list = () => {
        return new Promise((resolve, reject) => {
            app.get('redis').get(`${redisKeyList}`, (err, users) => {
                if (!err && users != null) {
                    logger.info(`Redis: GET ${redisKeyList}`);
                    resolve(JSON.parse(users));
                } else {
                    model.find().populate('teams').then(users => {
                        users.forEach((user, key) => {
                            delete users[key].password;
                        });
                        app.get('redis').set(`${redisKeyList}`, JSON.stringify(users));
                        logger.info(`Redis: SET ${redisKeyList}`);
                        resolve(users);
                    }, error => {
                        logger.error(error);
                        reject(error);
                    });
                }
            });
        });
    };

    dao.findById = (id) => {
        return new Promise((resolve, reject) => {
            app.get('redis').get(`${redisKeyFindById}${id}`, (err, user) => {
                if (!err && user != null) {
                    logger.info(`Redis: GET ${redisKeyFindById}${id}`);
                    resolve(JSON.parse(user));
                } else {
                    model.findOne({
                        _id: id,
                    }).populate('teams').then(user => {
                        delete user.password;
                        app.get('redis').set(`${redisKeyFindById}${id}`, JSON.stringify(user));
                        logger.info(`Redis: SET ${redisKeyFindById}${id}`);
                        resolve(user);
                    }, error => {
                        logger.error(error);
                        reject(error);
                    });
                }
            });
        });
    };

    dao.findByTeam = (team) => {
        return new Promise((resolve, reject) => {
            app.get('redis').get(`${redisKeyFindByTeam}${team}`, (err, users) => {
                if (!err && users != null) {
                    logger.info(`Redis: GET ${redisKeyFindByTeam}${team}`);
                    resolve(JSON.parse(users));
                } else {
                    model.find({
                        teams: { $in: [team] },
                        active: true
                    }).lean().sort({ name: 1 }).populate('teams').then(users => {
                        users.forEach((user, key) => {
                            delete users[key].password;
                        });
                        app.get('redis').set(`${redisKeyFindByTeam}${team}`, JSON.stringify(users));
                        logger.info(`Redis: SET ${redisKeyFindByTeam}${team}`);
                        resolve(users);
                    }, error => {
                        logger.error(error);
                        reject(error);
                    });
                }
            });
        });
    };

    dao.findByPassword = (user, password) => {
        return new Promise((resolve, reject) => {
            model.findOne({ user: user, password: password }).lean().populate('teams').then(user => {
                resolve(user);
            }, error => {
                logger.error(error);
                reject(error);
            });
        });
    };

    dao.insert = (user) => {
        return new Promise((resolve, reject) => {
            model.create(user).then(user => {
                clearRedisKeys();
                resolve(user);
            }, error => {
                logger.error(error);
                reject(error);
            });
        });
    };

    dao.update = (id, user) => {
        return new Promise((resolve, reject) => {
            model.findByIdAndUpdate(id, user, { new: true })
                .populate('teams')
                .then(user => {
                    clearRedisKeys();
                    resolve(user);
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
        app.get('redis').delRedisKeys(`${redisKeyFindByTeam}*`);
        app.get('redis').delRedisKeys(`${redisKeyList}`);
        app.get('redis').delRedisKeys(`${redisKeyFindById}*`);
    }

    return dao;
};