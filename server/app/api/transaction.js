const logger = require('../services/logger.js');
const mailer = require('../mailer/sender.js');

module.exports = app => {

    let api = {};
    const dao = app.dao.transaction;

    api.listByUser = (req, res) => {
        dao.listByUser(req.params.user, req.params.team).then(
            transactions => res.json(transactions),
            error => res.sendStatus(500)
        );
    };

    api.getWallet = (req, res) => {
        dao.findWallet(req.params.user, req.params.team).then(
            wallet => res.json(wallet),
            error => res.sendStatus(500)
        );
    }

    api.insert = async(req, res) => {
        const sprint = await app.dao.sprint.findCurrent();
        const wallet = await dao.findWallet(req.body.from._id, req.body.team._id, sprint);
        req.body.sprint = sprint;
        req.body.date = new Date();

        let errors = runExpressValidator(req, wallet);
        if (errors) {
            res.status(400).send(errors);
            return;
        }

        dao.insert(req.body).then(
            transaction => {
                emitTransaction(transaction);
                mailer.donationSent(transaction);
                res.json(transaction)
            },
            error => res.sendStatus(500)
        );
    };

    api.update = (req, res) => {
        let errors = runExpressValidator(req);
        if (errors) {
            res.status(400).send(errors);
            return;
        }

        dao.update(req.body).then(
            transaction => {
                emitTransaction(transaction);
                res.json(transaction)
            },
            error => res.sendStatus(500)
        );
    };

    let emitTransaction = (transaction) => {

        let type;
        let destinyID;

        const TransactionStatus = {
            NORMAL: 0,
            PENDING: 1,
            DENIED: 2,
            ACCEPTED: 3,
            CANCELED: 4
        };

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