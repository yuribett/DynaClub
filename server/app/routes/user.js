module.exports = app => {

	let api = app.api.user;

	app.route('/api/user')
		.get(api.list)
		.post(api.insert);

	app.route('/api/user/:id')
		.get(api.findById)
		.put(api.update)
		.delete(api.delete);

	app.route('/api/userTeam/:team')
		.get(api.findByTeam);

};