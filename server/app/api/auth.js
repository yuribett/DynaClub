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
					let token = jwt.sign({ auth: auth._id }, app.get('secret'), {
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
					model.findOne({ _id: decoded.auth })
						 .then(user => {
							 req.user = user;
							 next();
						 });
				}
			});
		} else {
			logger.error('Token not sent');
			return res.sendStatus(401);
		}
	}

	/**
	 * If request from admin user, triggers callback function, 
	 * otherwise returns response with http error 403.
	 */
    api.guardAdmin = (callback) => {
        return (req, res) => {
            if (!req.user.admin){
                res.status(403).send('Operation not allowed for current user (user not admin).');
                return;
            }
            callback(req, res);
        }
    }

	/**
	 * If user id param (urlUserId) from URL is equal logged in user, triggers callback function, 
	 * otherwise returns response with http error 403.
	 * To be used when filtering requests that should be allowed only when the data
	 * owner is the same as logged in user.
	 * 
	 * @param {string} urlUserId - owner of the object requested
	 */
    api.guardOwner = (callback, urlUserId = null) => {
        return (req, res) => {
			let objectOwner = urlUserId == null ? 
							req.params.user : req.params[urlUserId]; 
			let sessionUser = req.user._id;
            if (objectOwner != sessionUser){
                res.status(403).send('Operation not allowed for current user (user not author).');
                return;
            }
            callback(req, res);
        }
    }

	return api;
};