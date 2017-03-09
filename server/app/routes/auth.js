module.exports = app => {

	let api = app.api.auth;

	app.get('/api/oauth/jira', api.oAuthConnect);
	app.get('/api/oauth/jira/callback', api.oAuthCallback);

	app.post('/api/auth', api.authUser);
	app.use('/api/*', api.verifyToken);
};