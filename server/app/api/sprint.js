let logger = require('../services/logger.js');

module.exports = app => {

    let api = {};
    let dao = app.dao.sprint;

    api.list = (req, res) => {
        dao.list().then(
            sprints => res.json(sprints),
            error => res.sendStatus(500)
        );
    };

    api.findIntersected = (req, res) => {
        let date = req.params.date;
        dao.findIntersected(date).then(
            sprint => res.json(sprint),
            error => res.sendStatus(500)
        );
    };

    api.findById = (req, res) => {
        let id = req.params.id;
        dao.findById(id).then(
            sprint => res.json(sprint),
            error => res.sendStatus(500)
        );
    };

    api.findCurrent = (req, res) => {
        dao.findCurrent().then(
            sprint => res.json(doc),
            error => res.sendStatus(500)
        );
    };

    api.findLast = (req, res) => {
        const lastMonhDate = new Date();
        lastMonhDate.setMonth(lastMonhDate.getMonth() - 1);
        dao.findLast().then(
            sprint => res.json(sprint),
            error => res.sendStatus(500)
        );
    }

    api.insert = (req, res) => {
        let errors = runExpressValidator(req);
        if (errors) {
            logger.error('Bad request of sprint.insert');
            res.status(400).send(errors);
            return;
        }

        dao.insert(req.body).then(
            sprint => res.json(sprint),
            error => res.sendStatus(500)
        );
    };

    api.update = (req, res) => {
        let errors = runExpressValidator(req);
        if (errors) {
            logger.error('Bad request of sprint.update');
            res.status(400).send(errors);
            return;
        }

        dao.update(req.params.id, req.body).then(
            sprint => res.json(sprint),
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
        req.assert("dateStart", "sprint.dateStart is required and must be a date").notEmpty().isDate();
        req.assert("dateFinish", "sprint.dateFinish is required and must be a date").notEmpty().isDate();
        req.assert("initialAmount", "sprint.initialAmount is required and must be numeric").notEmpty().isNumeric();
        return req.validationErrors();
    }

    return api;
};