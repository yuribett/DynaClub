module.exports = app => {

	let api = app.api.auth;

	app.post('/auth', api.authUser);
	//app.use('/*', api.verifyToken);
};