module.exports = app => {

	let api = app.api.auth;

	app.post('/api/auth', api.authUser);
	app.get('/api/timesync', (req, res) => {
		res.json({
			"date": new Date()
		})
	});
	
	app.use('/api/*', api.verifyToken);
	
};