let mongoose = require('mongoose');
let logger = require('../services/logger.js');

module.exports = app => {

    let api = {};
    let model = mongoose.model('Transaction');
	const redisKeyListByUser = 'transaction:listByUser:';
	const redisKeyGetWallet = 'transaction:getWallet:';

    api.listByUser = (req, res) => {
        let user = req.params.user;
        let team = req.params.team;
        let sprint = req.params.sprint;

		app.get('redis').get(`${redisKeyListByUser}${user}:${team}:${sprint}`, (err, transactions) => {
            if (!err && transactions != null) {
                logger.info(`Redis: GET ${redisKeyListByUser}${user}:${team}:${sprint}`);
                res.json(JSON.parse(transactions));
            } else {
				model.find({
						$or: [
							{ 'to': user },
							{ 'from': user }
						],
						'team': team,
						'sprint': sprint
					})
					.sort({ date: -1 })
					.populate('to from sprint transactionType team')
					.then((transactions) => {
						app.get('redis').set(`${redisKeyListByUser}${user}:${team}:${sprint}`, JSON.stringify(transactions));
						logger.info(`Redis: SET ${redisKeyListByUser}${user}:${team}:${sprint}`);
						res.json(transactions);
					}, (error) => {
						logger.error(error);
						res.sendStatus(500);
					});
			}
		});

    };

    api.insert = (req, res) => {

        //TODO buscar do Redis/Mongo se o usuario tem saldo suficiente pra realizar a transaction
        //TODO validar se o valor enviado eh positivo
		//Utilizar express-validator cfe /user API
        if (false) {
            res.status(400).send("Saldo insuficiente");
            return false;
        }
        model.create(req.body)
            .then((transaction) => {
				clearRedisKeys();
                model.findOne({
                        _id: transaction._id,
                    })
                    .populate('to from sprint transactionType team')
                    .then((transaction) => {
                        // Sending transaction through socket.io
                        app.get('redis').get("user:" + transaction.to._id, (err, socketId) => {
                            emitTransaction(err, socketId, transaction);
                        });
                        app.get('redis').get("user:" + transaction.from._id, (err, socketId) => {
                            emitTransaction(err, socketId, transaction);
                        });
                        res.json(transaction);
                    }, (error) => {
                        logger.error(error);
                        res.sendStatus(500);
                    });
            }, (error) => {
                logger.error('cannot insert transaction');
                logger.error(error);
                res.sendStatus(500);
            });
    };

    let emitTransaction = (error, socketId, transaction) => {
        if (error) {
            logger.error('Error in getting socketId from Redis');
        } else {
            let socket = app.get('io').sockets.connected[socketId];
            if (typeof socket != "undefined") {
                socket.emit('transaction', transaction);
            }
        }
    }


    api.getWallet = (req, res) => {
        let user = req.params.user;
        let team = req.params.team;
        let sprint = req.params.sprint;

		app.get('redis').get(`${redisKeyGetWallet}${user}:${team}:${sprint}`, (err, wallet) => {
            if (!err && wallet != null) {
                logger.info(`Redis: GET ${redisKeyGetWallet}${user}:${team}:${sprint}`);
                res.json(JSON.parse(wallet));
            } else {
				model.aggregate([{
						$match: {
							$or: [
								{ 'to': mongoose.Types.ObjectId(user) },
								{ 'from': mongoose.Types.ObjectId(user) }
							],
							'team': mongoose.Types.ObjectId(team),
							'sprint': mongoose.Types.ObjectId(sprint)
						}
					},
					{
						$project: {
							amount: 1,
							received: {
								$cond: {
									if: { '$eq': ['$to', mongoose.Types.ObjectId(user)] },
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
						totalDonated: 0
					};
					result.forEach((row) => {
						if (row.received) {
							wallet.totalReceived = row.total;
						} else {
							wallet.totalDonated = row.total;
						}
					});
					app.get('redis').set(`${redisKeyGetWallet}${user}:${team}:${sprint}`, JSON.stringify(wallet));
					logger.info(`Redis: SET ${redisKeyGetWallet}${user}:${team}:${sprint}`);
					res.json(wallet);
				}, error => {
					logger.error('cannot load wallet');
					logger.error(error);
					res.sendStatus(500);
				});
			}
		});
    }

	let clearRedisKeys = () => {
        app.get('redis').delRedisKeys(`${redisKeyListByUser}*`);
        app.get('redis').delRedisKeys(`${redisKeyGetWallet}*`);
    }

    return api;
};