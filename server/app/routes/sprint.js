module.exports = function (app) {

	var api = app.api.sprint;

	app.route('/sprint')
		.get(api.list)
		.post(api.insert);

	app.route('/sprint/:id')
		.get(api.findById)
		.put(api.update)
		.delete(api.delete);
};