module.exports = app => {

	let api = app.api.sprint;
	let auth = app.api.auth;

	app.route('/api/sprint')
		.get(api.list)
		.post(auth.guardAdmin(api.insert));

	app.route('/api/sprint/find/current')
		.get(api.findCurrent)

	app.route('/api/sprint/find/last')
		.get(api.findLast)
	
	app.route('/api/sprint/:id')
		.get(api.findById)
		.put(auth.guardAdmin(api.update))
		.delete(auth.guardAdmin(api.delete));

	app.route('/api/sprint/intersects/:date')
		.get(api.findIntersected)
	
	
};