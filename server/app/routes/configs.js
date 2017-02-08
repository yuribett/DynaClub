module.exports = app => {

	let api = app.api.configs;

	app.route('/configs')
		.get(api.list)
		.post(api.insert)
		.put(api.update);

};