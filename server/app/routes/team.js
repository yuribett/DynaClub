module.exports = function (app) {

	var api = app.api.team;

	app.route('/team')
		.get(api.list)
		.post(api.insert);

	app.route('/team/:id')
		.get(api.findById)
		.put(api.update)
		.delete(api.delete);
};