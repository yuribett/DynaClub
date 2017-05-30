let logger = require('../services/logger.js');

module.exports = app => {

    let api = {};
    let dao = app.dao.user;

    api.list = (req, res) => {
        dao.list().then(
            usersList => res.json(userList),
            error => res.sendStatus(500)
        );
    };

    api.findById = (req, res) => {
        let id = req.params.id;
        dao.findById(id).then(
            user => res.json(user),
            error => res.sendStatus(500)
        );
    };

    api.findByTeam = (req, res) => {
        let team = req.params.team;
        dao.findByTeam(team).then(
            users => res.json(users),
            error => res.sendStatus(500)
        );
    };

    api.insert = (req, res) => {
        let errors = runExpressValidator(req);
        if (errors) {
            res.status(400).send(errors);
            return;
        }

        dao.insert(req.body).then(
            user => res.json(user),
            error => res.sendStatus(500)
        );
    };

    api.update = (req, res) => {
        let errors = runExpressValidator(req);
        if (errors) {
            res.status(400).send(errors);
            return;
        }

        dao.update(req.params.id, req.body).then(
            user => res.json(user),
            error => es.sendStatus(500)
        );
    };

    api.delete = (req, res) => {
        dao.delete(req.params.id).then(
            success => res.sendStatus(200),
            error => res.sendStatus(500)
        );
    };

    let runExpressValidator = (req) => {
        req.assert("name", "user.name is required").notEmpty();
        req.assert("email", "user.email is required and must be an email").notEmpty().isEmail();
        req.assert("user", "user.user is required and must have between 3 and 15 characters").notEmpty().len(3, 15);
        req.assert("password", "user.password is required and must have between 6 and 20 characters").notEmpty().len(6, 20);
        req.assert("teams", "user.teams is required").notEmpty().isArray();
        req.assert("active", "user.active is required and must be boolean").notEmpty().isBoolean();
        req.assert("admin", "user.admin is required and must be boolean").notEmpty().isBoolean();

        return req.validationErrors();
    }

    return api;
};