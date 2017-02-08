let mongoose = require('mongoose');
let logger = require('../services/logger.js');

module.exports = app => {

    let api = {};

    let model = mongoose.model('Transaction');

    api.listByUser = (req, res) => {
        let user = req.params.user;
        let team = req.params.team;
        let sprint = req.params.sprint;
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
                res.json(transactions);
            }, (error) => {
                logger.error(error);
                res.sendStatus(500);
            });

    };

    api.insert = (req, res) => {
        model.create(req.body)
            .then((transaction) => {
                model.findOne({
                    _id: transaction._id,
                })
                    .populate('to from sprint transactionType team')
                    .then((transaction) => {
                        // Sending transaction through socket.io
                        app.get('redis').get("user:" + transaction.to, (err, socketId) => {
                            if (err) {
                                logger.error('Error in getting socketId from Redis');
                            } else {
                                app.get('io').sockets.connected[socketId].emit('transaction', transaction);
                            }
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

    return api;
};