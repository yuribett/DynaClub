let logger = require('../services/logger.js');

module.exports = app => {

    let api = {};
    let dao = app.dao.team;
    
    api.list = (req, res) => {
        dao.list().then(
            teams => res.json(teams),
            error => res.sendStatus(500)
        );
    };

    api.findByName = (req, res) => {
        dao.findByName(req.params.name).then(
            team => res.json(team),
            error => res.sendStatus(500)
        );
    };

    api.findById = (req, res) => {
        dao.findById(req.params.id).then(
            team => res.json(team),
            error => res.sendStatus(500)
        );
    };

    api.insert = (req, res) => {
        let errors = runExpressValidator(req);
        if (errors) {
            logger.error('Bad request of team.insert');
            res.status(400).send(errors);
            return;
        }

        dao.insert(req.body).then(
            team => res.json(team),
            error => res.sendStatus(500)
        );
    };

    api.update = (req, res) => {
        let errors = runExpressValidator(req);
        if (errors) {
            logger.error('Bad request of team.update');
            res.status(400).send(errors);
            return;
        }

        dao.update(req.params.id, req.body).then(
            team => res.json(team),
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
        req.assert("name", "team.name is required").notEmpty();
        req.assert("active", "team.active is required and must be boolean").notEmpty().isBoolean();
        return req.validationErrors();
    }

    return api;
};