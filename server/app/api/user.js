let mongoose = require('mongoose');
let logger = require('../services/logger.js');

module.exports = app => {

    let api = {};

    let model = mongoose.model('User');

    api.list = (req, res) => {

        model.find()
            .populate('teams')
            .then((users) => {
                res.json(users);
            }, (error) => {
                logger.error(error);
                res.sendStatus(500);
            });

    };

    api.findById = (req, res) => {
        model.findOne({
                _id: req.params.id,
            })
            .populate('teams')
            .then((user) => {
                res.json(user);
            }, (error) => {
                logger.error(error);
                res.sendStatus(500);
            });
    };

    api.findByTeam = (req, res) => {
        model.find({
                teams: { $in: [req.params.team] },
                active: true
            })
            .populate('teams')
            .then((user) => {
                res.json(user);
            }, (error) => {
                logger.error(error);
                res.sendStatus(500);
            });
    };

    api.insert = (req, res) => {
        model.create(req.body)
            .then((user) => {
                res.json(user);
            }, (error) => {
                logger.error('cannot insert user');
                logger.error(error);
                res.sendStatus(500);
            });
    };

    api.update = (req, res) => {
        logger.error('update');
        model.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('teams')
            .then((user) => {
                logger.error(user);
                res.json(user);
            }, (error) => {
                logger.error(error);
                res.sendStatus(500);
            })
    };

    api.delete = (req, res) => {
        model.remove({ '_id': req.params.id })
            .then(() => {
                res.sendStatus(200);
            }, (error) => {
                logger.error(error);
                res.sendStatus(500);
            });
    };


    return api;
};