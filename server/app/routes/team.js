module.exports = app => {

	let api = app.api.team;

	app.route('/team')
		.get(api.list)
		.post(api.insert);

	app.route('/team/:id')
		.get(api.findById)
		.put(api.update)
		.delete(api.delete);

	app.route('/team/name/:name')
		.get(api.findByName);
};