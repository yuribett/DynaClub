let mongoose = require('mongoose');
let logger = require('../services/logger.js');

module.exports = app => {

    let api = {};
    let dao = app.dao.ranking;

    api.list = (req, res) => {
        let teamID = req.params.team;
        let sprintID = req.params.sprint;
        dao.list(teamID, sprintID).then(
            ranking => res.json(ranking),
            error => res.sendStatus(500)
        );
    };

    return api;
};

