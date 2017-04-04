module.exports = app => {

	let api = app.api.transactionType;
	let auth = app.api.auth;

	app.route('/api/transactionType')
		.get(api.list)
		.post(auth.guardAdmin(api.insert));

	app.route('/api/transactionType/:id')
		.get(api.findById)
		.put(auth.guardAdmin(api.update))
		.delete(auth.guardAdmin(api.delete));
};