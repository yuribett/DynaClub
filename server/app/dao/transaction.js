let mongoose = require('mongoose');
let logger = require('../services/logger.js');

module.exports = app => {

    let dao = {};
    let model = mongoose.model('Transaction');
    const redisKeyListByUser = 'transaction:listByUser:';
    const redisKeyGetWallet = 'transaction:getWallet:';

    dao.listByUser = (user, team) => {
        return new Promise(async (resolve, reject) => {
            const sprint = await app.dao.sprint.findCurrent();
            app.get('redis').get(`${redisKeyListByUser}${user}:${team}:${sprint._id}`, (err, transactions) => {
                if (!err && transactions != null) {
                    logger.info(`Redis: GET ${redisKeyListByUser}${user}:${team}:${sprint._id}`);
                    resolve(JSON.parse(transactions));
                } else {
                    model.find({
                        $or: [{ 'to': user }, { 'from': user }],
                        'team': team,
                        'sprint': sprint._id
                    }).lean().sort({ date: -1 }).populate('to from requester sprint transactionType team')
                        .then(transactions => {
                            transactions.forEach((transaction, key) => {
                                delete transactions[key].to.password;
                                delete transactions[key].from.password;
                                if (transactions[key].requester) {
                                    delete transactions[key].requester.password;
                                }
                            });
                            app.get('redis').set(`${redisKeyListByUser}${user}:${team}:${sprint._id}`, JSON.stringify(transactions));
                            logger.info(`Redis: SET ${redisKeyListByUser}${user}:${team}:${sprint._id}`);
                            resolve(transactions);
                        }, error => {
                            logger.error(error);
                            reject(error)
                        });
                }
            });
        });
    };

    dao.findWallet = (userID, teamID, sprint) => {
        return new Promise(async (resolve, reject) => {
            if (!sprint) {
                sprint = await app.dao.sprint.findCurrent();
            }
            app.get('redis').get(`${redisKeyGetWallet}${userID}:${teamID}:${sprint._id}`, (err, wallet) => {
                if (!err && wallet != null) {
                    logger.info(`Redis: GET ${redisKeyGetWallet}${userID}:${teamID}:${sprint._id}`);
                    resolve(JSON.parse(wallet));
                } else {
                    model.aggregate([{
                        $match: {
                            $or: [{ 'to': mongoose.Types.ObjectId(userID) }, { 'from': mongoose.Types.ObjectId(userID) }],
                            'status': { $in: [null, 0, 3] },//NORMAL OR ACCEPTED
                            'team': mongoose.Types.ObjectId(teamID),
                            'sprint': mongoose.Types.ObjectId(sprint._id)
                        }
                    }, {
                        $project: {
                            amount: 1,
                            received: {
                                $cond: { if: { '$eq': ['$to', mongoose.Types.ObjectId(userID)] }, then: true, else: false }
                            }
                        }
                    }, {
                        $group: {
                            _id: '$received',
                            total: { $sum: "$amount" }
                        }
                    }, {
                        $project: {
                            _id: 0,
                            total: 1,
                            received: {
                                $cond: { if: { '$eq': ['$_id', true] }, then: true, else: false }
                            }
                        }
                    }]).then(result => {
                        let wallet = {
                            totalReceived: 0,
                            totalDonated: 0,
                            funds: 0
                        };
                        result.forEach(row => {
                            if (row.received) {
                                wallet.totalReceived = row.total;
                            } else {
                                wallet.totalDonated = row.total;
                            }
                        });
                        wallet.funds = sprint.initialAmount - wallet.totalDonated;
                        app.get('redis').set(`${redisKeyGetWallet}${userID}:${teamID}:${sprint._id}`, JSON.stringify(wallet));
                        logger.info(`Redis: SET ${redisKeyGetWallet}${userID}:${teamID}:${sprint._id}`);
                        resolve(wallet);
                    }, error => {
                        logger.error('cannot load wallet');
                        logger.error(error);
                        reject(error);
                    });
                }
            });
        });
    }

    dao.insert = (transaction) => {
        return new Promise((resolve, reject) => {
            model.create(transaction).then(transaction => {
                model.findOne({ _id: transaction._id })
                    .populate('to from requester sprint transactionType team')
                    .then(transaction => {
                        clearRedisKeys(transaction);
                        resolve(transaction);
                    }, error => {
                        throw error;
                    });
            }, error => {
                logger.error('cannot insert transaction');
                logger.error(error);
                reject(error);
            });
        });
    }

    dao.update = (transaction) => {
        return new Promise(async (resolve, reject) => {
            model.findByIdAndUpdate(transaction._id, transaction, { new: true })
                .populate('to from requester sprint transactionType team')
                .then(transaction => {
                    clearRedisKeys(transaction);
                    resolve(transaction);
                }, error => {
                    logger.error(error);
                    reject(error);
                });
        });
    };

    let clearRedisKeys = (transaction) => {
        // TO
        app.get('redis').delRedisKeys(`${redisKeyListByUser}${transaction.to._id}:${transaction.team._id}:${transaction.sprint._id}`);
        app.get('redis').delRedisKeys(`${redisKeyGetWallet}${transaction.to._id}:${transaction.team._id}:${transaction.sprint._id}`);

        // FROM
        app.get('redis').delRedisKeys(`${redisKeyListByUser}${transaction.from._id}:${transaction.team._id}:${transaction.sprint._id}`);
        app.get('redis').delRedisKeys(`${redisKeyGetWallet}${transaction.from._id}:${transaction.team._id}:${transaction.sprint._id}`);
    }

    return dao;
};