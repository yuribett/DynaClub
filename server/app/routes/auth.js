module.exports = app => {

	let api = app.api.auth;

	app.post('/api/auth', api.authUser);
	app.use('/api/*', api.verifyToken);
	app.get('/api/timesync', (req, res) => {
		res.json({
			"date": new Date()
		})
	});
};