module.exports = app => {

	let api = app.api.sprint;

	app.route('/api/sprint')
		.get(api.list)
		.post(api.insert);

	app.route('/api/sprint/:id')
		.get(api.findById)
		.put(api.update)
		.delete(api.delete);
};