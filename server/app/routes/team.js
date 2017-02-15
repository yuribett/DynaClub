module.exports = app => {

	let api = app.api.team;

	app.route('/api/team')
		.get(api.list)
		.post(api.insert);

	app.route('/api/team/:id')
		.get(api.findById)
		.put(api.update)
		.delete(api.delete);

	app.route('/api/team/name/:name')
		.get(api.findByName);
};