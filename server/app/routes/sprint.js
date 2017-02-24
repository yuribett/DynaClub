module.exports = app => {

	let api = app.api.sprint;

	app.route('/api/sprint')
		.get(api.list)
		.post(api.insert);

	app.route('/api/sprint/find/current')
		.get(api.findCurrent)

	app.route('/api/sprint/find/last')
		.get(api.findLast)
	
	app.route('/api/sprint/:id')
		.get(api.findById)
		.put(api.update)
		.delete(api.delete);

	app.route('/api/sprint/intersects/:date')
		.get(api.findIntersected)
	
	
};