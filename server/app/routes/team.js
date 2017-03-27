module.exports = app => {

	let api = app.api.team;
	let auth = app.api.auth;

	app.route('/api/team')
		.get(api.list)
		.post(auth.guardAdmin(api.insert));

	app.route('/api/team/:id')
		.get(api.findById)
		.put(auth.guardAdmin(api.update))
		.delete(auth.guardAdmin(api.delete));

	app.route('/api/team/name/:name')
		.get(api.findByName);
};