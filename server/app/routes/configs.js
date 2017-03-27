module.exports = app => {

	let api = app.api.configs;
	let auth = app.api.auth;

	app.route('/api/configs')
		.get(api.list)
		.post(auth.guardAdmin(api.insert))
		.put(auth.guardAdmin(api.update));

};