module.exports = app => {

	let api = app.api.auth;

	app.post('/api/auth', api.authUser);
	app.use('/api/*', api.verifyToken);
};