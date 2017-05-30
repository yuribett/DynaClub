let logger = require('../services/logger.js');

module.exports = app => {

    let api = {};
    let dao = app.dao.transactionType;

    api.list = (req, res) => {
        dao.list().then(
            types => res.json(types),
            error => res.sendStatus(500)
        );
    };

    api.findById = (req, res) => {
        dao.findById(req.params.id).then(
            type => res.json(type),
            error => res.sendStatus(500)
        );
    };

    api.insert = (req, res) => {
        let errors = runExpressValidator(req);
        if (errors) {
            logger.error('Bad request of transactionType.insert');
            res.status(400).send(errors)
            return;
        }

        dao.insert(req.body).then(
            type => res.json(type),
            error => res.sendStatus(500)
        );
    };

    api.update = (req, res) => {
        let errors = runExpressValidator(req);
        if (errors) {
            logger.error('Bad request of transactionType.update');
            res.status(400).send(errors);
            return;
        }

        dao.insert(req.params.id, req.body).then(
            type => res.json(type),
            error => res.sendStatus(500)
        );
    };

    api.delete = (req, res) => {
        dao.delete(req.params.id).then(
            success => res.sendStatus(200),
            error => res.sendStatus(500)
        );
    };

    let runExpressValidator = (req) => {
        req.assert("description", "transactionType.description is required").notEmpty();
        return req.validationErrors();
    }

    return api;
};