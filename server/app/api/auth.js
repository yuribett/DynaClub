let mongoose = require('mongoose');
let jwt = require('jsonwebtoken');
let logger = require('../services/logger.js');
let uuid = require('node-uuid');

module.exports = app => {

	let api = {};
	let model = mongoose.model('User');
	let teamModel = mongoose.model('Team');

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

	/**
	 * Endpoint called from the client to request an access token to access the application.
	 */
	api.oAuthConnect = (req, res) => {
		app.get('jira').connect(req, res)
	}

	/**
	 * Endpoint called from the oAuth provider authorizing or not the user request.
	 */
	api.oAuthCallback = (req, res) => {
		app.get('jira').callback(req, res)
			.then(jiraResult => {
				let user = jiraResult.key;
				let localData = model.findOne({
					user: user
				}).populate('teams');
				let jiraData = Promise.resolve(jiraResult);
				return Promise.all([localData, jiraData]);
			})
			.then(values => {
				let localData = values[0];
				let jiraData = values[1];
				if (!localData) {
					return createUserFromOAuth(jiraData)
				}
				return Promise.resolve(localData);
			})
			.then(auth => {
				responseUserAuthentication(req, res, auth)
			})
			.catch(error => {
				console.log("Error " + JSON.stringify(error));		
				res.sendStatus(500)
			})
	}
	createUserFromOAuth = (jiraData) => {
		let rd_password = uuid.v4();
		return teamModel.findOne({'name': 'DynaClub'})
			.then( default_team => {
		return model.create({
				name: jiraData.displayName,
				email: jiraData.emailAddress,
				user: jiraData.key,
					password: rd_password, // generate unique random password
					teams: [default_team._id], 
				active: jiraData.active,
				admin: false
			})
			.then(user => {
				return model.findOne({
						_id: user._id
					})
					.populate('teams');			
			})
				.catch(error => {
					console.log("Error " + JSON.stringify(error));
				});
		});
	}

	responseUserAuthentication = (req, res, auth) => {
		logger.info('User authenticated: ' + auth.user);
		let token = jwt.sign({
			auth: auth.user
		}, app.get('secret'), {
			expiresIn: 7614000
		});
		//setting password to null to response
		auth.password = null;
		res.set('x-access-token', token);
		res.json(auth);
		res.end();
	}

	return api;
};