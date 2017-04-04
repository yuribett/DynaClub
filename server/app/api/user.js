let mongoose = require('mongoose');
let logger = require('../services/logger.js');

module.exports = app => {

    let api = {};
    let model = mongoose.model('User');
    const redisKeyFindByTeam = 'user:findByTeam:';
    const redisKeyList = 'user:list';
    const redisKeyFindById = 'user:findById:';

    api.list = (req, res) => {
        app.get('redis').get(`${redisKeyList}`, (err, users) => {
            if (!err && users != null) {
                logger.info(`Redis: GET ${redisKeyList}`);
                res.json(JSON.parse(users));
            } else {
                model.find()
                    .populate('teams')
                    .then((users) => {
                        app.get('redis').set(`${redisKeyList}`, JSON.stringify(users));
                        logger.info(`Redis: SET ${redisKeyList}`);
                        res.json(users);
                    }, (error) => {
                        logger.error(error);
                        res.sendStatus(500);
                    });
            }
        });

    };

    api.findById = (req, res) => {
        let id = req.params.id;

        app.get('redis').get(`${redisKeyFindById}${id}`, (err, user) => {
            if (!err && user != null) {
                logger.info(`Redis: GET ${redisKeyFindById}${id}`);
                res.json(JSON.parse(user));
            } else {
                model.findOne({
                        _id: id,
                    })
                    .populate('teams')
                    .then((user) => {
                        delete user.password;
                        app.get('redis').set(`${redisKeyFindById}${id}`, JSON.stringify(user));
                        logger.info(`Redis: SET ${redisKeyFindById}${id}`);
                        res.json(user);
                    }, (error) => {
                        logger.error(error);
                        res.sendStatus(500);
                    });
            }
        });
    };

    api.findByTeam = (req, res) => {
        let team = req.params.team;
        app.get('redis').get(`${redisKeyFindByTeam}${team}`, (err, users) => {
            if (!err && users != null) {
                logger.info(`Redis: GET ${redisKeyFindByTeam}${team}`);
                res.json(JSON.parse(users));
            } else {
                model.find({
                        teams: { $in: [team] },
                        active: true
                    })
                    .lean()
                    .sort({ name: 1 })
                    .populate('teams')
                    .then((users) => {
                        users.forEach((user, key) => {
                            delete users[key].password;
                        });
                        app.get('redis').set(`${redisKeyFindByTeam}${team}`, JSON.stringify(users));
                        logger.info(`Redis: SET ${redisKeyFindByTeam}${team}`);
                        res.json(users);
                    }, (error) => {
                        logger.error(error);
                        res.sendStatus(500);
                    });
            }
        });
    };

    api.insert = (req, res) => {

        let errors = runExpressValidator(req);

        if (errors) {
            logger.error('Bad request of user.insert');
            res.status(400).send(errors);
            return;
        }

        model.create(req.body)
            .then((user) => {
                clearRedisKeys();
                res.json(user);
            }, (error) => {
                logger.error('cannot insert user');
                logger.error(error);
                res.sendStatus(500);
            });
    };

    api.update = (req, res) => {

        let errors = runExpressValidator(req);

        if (errors) {
            logger.error('Bad request of user.update');
            res.status(400).send(errors);
            return;
        }

        model.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('teams')
            .then((user) => {
                clearRedisKeys();
                res.json(user);
            }, (error) => {
                logger.error(error);
                res.sendStatus(500);
            })
    };

    api.delete = (req, res) => {
        model.remove({ '_id': req.params.id })
            .then(() => {
                clearRedisKeys();
                res.sendStatus(200);
            }, (error) => {
                logger.error(error);
                res.sendStatus(500);
            });
    };

    let clearRedisKeys = () => {
        app.get('redis').delRedisKeys(`${redisKeyFindByTeam}*`);
        app.get('redis').delRedisKeys(`${redisKeyList}`);
        app.get('redis').delRedisKeys(`${redisKeyFindById}*`);
    }

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