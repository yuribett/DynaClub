let mongoose = require('mongoose');
let logger = require('../services/logger.js');

module.exports = app => {

    let api = {};
    let model = mongoose.model('Transaction');
    let sprintApi = app.api.sprint;
    const redisKeyListByUser = 'transaction:listByUser:';
    const redisKeyGetWallet = 'transaction:getWallet:';

    api.listByUser = (req, res) => {
        let user = req.params.user;
        let team = req.params.team;
        sprintApi.findSprintByDate(new Date())
            .then(sprint => {
                app.get('redis').get(`${redisKeyListByUser}${user}:${team}:${sprint._id}`, (err, transactions) => {
                    if (!err && transactions != null) {
                        logger.info(`Redis: GET ${redisKeyListByUser}${user}:${team}:${sprint._id}`);
                        res.json(JSON.parse(transactions));
                    } else {
                        model.find({
                            $or: [
                                { 'to': user },
                                { 'from': user }
                            ],
                            'team': team,
                            'sprint': sprint._id
                        })
                            .lean()
                            .sort({ date: -1 })
                            .populate('to from requester sprint transactionType team')
                            .then((transactions) => {

                                transactions.forEach((transaction, key) => {
                                    delete transactions[key].to.password;
                                    delete transactions[key].from.password;
                                    if (transactions[key].requester) {
                                        delete transactions[key].requester.password;
                                    }
                                });

                                app.get('redis').set(`${redisKeyListByUser}${user}:${team}:${sprint._id}`, JSON.stringify(transactions));
                                logger.info(`Redis: SET ${redisKeyListByUser}${user}:${team}:${sprint._id}`);
                                res.json(transactions);
                            }, (error) => {
                                logger.error(error);
                                res.sendStatus(500)
                            });
                    }
                });
            });

    };

    api.insert = (req, res) => {
        let user = req.body.from;
        let team = req.body.team;
        sprintApi.findSprintByDate(new Date())
            .then(sprint => {
                req.body.sprint = sprint;
                return findWallet(user._id, team._id, sprint)
            })
            .then(wallet => insertTransaction(req, res, wallet));
    };

    let insertTransaction = (req, res, wallet) => {
        req.body.date = new Date();
        let errors = runExpressValidator(req, wallet.funds);
        if (errors) {
            res.status(400).send(errors);
            return;
        }
        model.create(req.body).then(transaction => {
            model.findOne({ _id: transaction._id })
                .populate('to from requester sprint transactionType team')
                .then(transaction => {
                    clearRedisKeys(transaction);
                    // Sending transaction through socket.io
                    emitTransaction(transaction);
                    res.json(transaction);
                }, error => {
                    throw error;
                });
        }, error => {
            logger.error('cannot insert transaction');
            logger.error(error);
            res.sendStatus(500);
        });
    }

    const TransactionStatus = {
        NORMAL: 0,
        PENDING: 1,
        DENIED: 2,
        ACCEPTED: 3,
        CANCELED: 4
    };

    let emitTransaction = (transaction) => {

        let type;
        let destinyID;
        switch (transaction.status) {
            case TransactionStatus.NORMAL:
                type = "transaction.added";
                destinyID = transaction.to._id
                break;
            case TransactionStatus.PENDING:
                type = "transaction.requested";
                destinyID = transaction.from._id
                break;
            case TransactionStatus.DENIED:
                type = "transaction.denied";
                destinyID = transaction.requester._id
                break;
            case TransactionStatus.ACCEPTED:
                type = "transaction.accepted";
                destinyID = transaction.requester._id
                break;
            case TransactionStatus.CANCELED:
                if (JSON.stringify(transaction.requester._id) == JSON.stringify(transaction.from._id)) {
                    type = "transaction.canceled";
                    destinyID = transaction.to._id;
                } else {
                    type = "transaction.request.canceled";
                    destinyID = transaction.from._id;
                }
                break;
        }

        app.get('redis').get("user:" + destinyID, (err, socketId) => {
            if (err) {
                logger.error('Error in getting socketId from Redis');
            } else {
                let socket = app.get('io').sockets.connected[socketId];
                if (typeof socket != "undefined") {
                    socket.emit(type, transaction);
                }
            }
        });
    }

    api.getWallet = (req, res) => {
        let userID = req.params.user;
        let teamID = req.params.team;
        sprintApi.findSprintByDate(new Date())
            .then(sprint => findWallet(userID, teamID, sprint))
            .then(wallet => res.json(wallet), error => res.sendStatus(500));
    }

    let findWallet = (userID, teamID, sprint) => {
        return new Promise((resolve, reject) => {
            app.get('redis').get(`${redisKeyGetWallet}${userID}:${teamID}:${sprint._id}`, (err, wallet) => {
                if (!err && wallet != null) {
                    logger.info(`Redis: GET ${redisKeyGetWallet}${userID}:${teamID}:${sprint._id}`);
                    resolve(JSON.parse(wallet));
                } else {
                    model.aggregate([{
                        $match: {
                            $or: [
                                { 'to': mongoose.Types.ObjectId(userID) },
                                { 'from': mongoose.Types.ObjectId(userID) }
                            ],
                            'status': {
                                $in: [null, 0, 3] //NORMAL OR ACCEPTED
                            },
                            'team': mongoose.Types.ObjectId(teamID),
                            'sprint': mongoose.Types.ObjectId(sprint._id)
                        }
                    },
                    {
                        $project: {
                            amount: 1,
                            received: {
                                $cond: {
                                    if: { '$eq': ['$to', mongoose.Types.ObjectId(userID)] },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    },
                    {
                        $group: {
                            _id: '$received',
                            total: { $sum: "$amount" }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            total: 1,
                            received: {
                                $cond: {
                                    if: { '$eq': ['$_id', true] },
                                    then: true,
                                    else: false
                                }
                            }
                        }
                    }
                    ]).then(result => {
                        let wallet = {
                            totalReceived: 0,
                            totalDonated: 0,
                            funds: 0
                        };
                        result.forEach((row) => {
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

    api.update = (req, res) => {
        let errors = runExpressValidator(req);
        if (errors) {
            logger.error('Bad request of transaction.update');
            res.status(400).send(errors);
            return;
        }

        model.findByIdAndUpdate(req.body._id, req.body, { new: true })
            .populate('to from requester sprint transactionType team')
            .then(transaction => {
                clearRedisKeys(transaction);
                // Sending transaction through socket.io
                emitTransaction(transaction);
                res.json(transaction);
            }, error => {
                logger.error(error);
                res.sendStatus(500);
            })
    };

    let clearRedisKeys = (transaction) => {
        // TO
        app.get('redis').delRedisKeys(`${redisKeyListByUser}${transaction.to._id}:${transaction.team._id}:${transaction.sprint._id}`);
        app.get('redis').delRedisKeys(`${redisKeyGetWallet}${transaction.to._id}:${transaction.team._id}:${transaction.sprint._id}`);

        // FROM
        app.get('redis').delRedisKeys(`${redisKeyListByUser}${transaction.from._id}:${transaction.team._id}:${transaction.sprint._id}`);
        app.get('redis').delRedisKeys(`${redisKeyGetWallet}${transaction.from._id}:${transaction.team._id}:${transaction.sprint._id}`);
    }

    let runExpressValidator = (req, funds) => {
        const status = req.body.status;
        req.assert("from", "transaction.from is required").notEmpty();
        req.assert("to", "transaction.to is required").notEmpty();
        req.assert("date", "transaction.date is required and must be a date").notEmpty().isDate();
        req.assert("amount", "transaction.amount is required and must be a number greater than zero").notEmpty().isNumeric().gte(1);
        if (funds && (status == 0 || status == 3)) {
            req.assert("amount", "insuficient funds").lte(funds);
        }
        req.assert("team", "transaction.team is required").notEmpty();
        req.assert("transactionType", "transaction.transactionType is required").notEmpty();
        req.assert("message", "transaction.message is required and must have between 3 and 500 characters").notEmpty().len(3, 500);
        return req.validationErrors();
    }

    return api;
};