module.exports = app => {

	let api = app.api.transactionType;

	app.route('/api/transactionType')
		.get(api.list)
		.post(api.insert);

	app.route('/api/transactionType/:id')
		.get(api.findById)
		.put(api.update)
		.delete(api.delete);
};