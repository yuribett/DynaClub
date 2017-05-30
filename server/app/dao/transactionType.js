let mongoose = require('mongoose');
let logger = require('../services/logger.js');

module.exports = app => {

    let dao = {};
    let model = mongoose.model('TransactionType');
    const redisKeyList = 'transactionType:list';
    const redisKeyFindById = 'transactionType:findById:';

    dao.list = () => {
        return new Promise((resolve, reject) => {
            app.get('redis').get(`${redisKeyList}`, (err, transactionTypes) => {
                if (!err && transactionTypes != null) {
                    logger.info(`Redis: GET ${redisKeyList}`);
                    resolve(JSON.parse(transactionTypes));
                } else {
                    model.find().sort({ description: 1 }).then(transactionTypes => {
                        app.get('redis').set(`${redisKeyList}`, JSON.stringify(transactionTypes));
                        logger.info(`Redis: SET ${redisKeyList}`);
                        resolve(transactionTypes);
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
            app.get('redis').get(`${redisKeyFindById}${id}`, (err, transactionType) => {
                if (!err && transactionType != null) {
                    logger.info(`Redis: GET ${redisKeyFindById}${id}`);
                    resolve(JSON.parse(transactionType));
                } else {
                    model.findOne({
                        _id: id
                    }).then(transactionType => {
                        app.get('redis').set(`${redisKeyFindById}${id}`, JSON.stringify(transactionType));
                        logger.info(`Redis: SET ${redisKeyFindById}${id}`);
                        resolve(transactionType);
                    }, error => {
                        logger.error(error);
                        reject(error);
                    });
                }
            });
        });
    };

    dao.insert = (transactionType) => {
        return new Promise((resolve, reject) => {
            model.create(transactionType).then(transactionType => {
                clearRedisKeys();
                resolve(transactionType);
            }, error => {
                logger.error('cannot insert transactionType');
                logger.error(error);
                reject(error);
            });
        });
    };

    dao.update = (id, transactionType) => {
        return new Promise((resolve, reject) => {
            model.findByIdAndUpdate(id, transactionType, { new: true }).then(transactionType => {
                clearRedisKeys();
                resolve(transactionType);
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

    let runExpressValidator = (req) => {
        req.assert("description", "transactionType.description is required").notEmpty();
        return req.validationErrors();
    }

    return dao;
};