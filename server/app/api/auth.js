let mongoose = require('mongoose');
let jwt = require('jsonwebtoken');
let logger = require('../services/logger.js');

module.exports = app => {

	let api = {};
	let model = mongoose.model('User');

	api.authUser = (req, res) => {

		model.findOne({
			user: req.body.user,
			password: req.body.password
		})
			.lean()
			.populate('teams')
			.then((auth) => {
				if (!auth) {
					logger.error('Login or password incorrect: ' + req.body.user);
					res.sendStatus(401);
				} else {
					logger.info('User authenticated: ' + req.body.user);
					let token = jwt.sign({ auth: auth.user }, app.get('secret'), {
						expiresIn: 7614000
					});
					delete auth.password;

					res.set('x-access-token', token);
					res.json(auth);
					res.end();
				}
			});
	};

	api.verifyToken = (req, res, next) => {
		logger.debug('verifying token: ' + JSON.stringify(req.body));
		let token = req.headers['x-access-token'];

		if (token) {
			jwt.verify(token, app.get('secret'), (err, decoded) => {
				if (err) {
					logger.error('Token rejected');
					return res.sendStatus(401);
				} else {
					req.usuario = decoded;
					next();
				}
			});
		} else {
			logger.error('Token not sent');
			return res.sendStatus(401);
		}
	}

	return api;
};