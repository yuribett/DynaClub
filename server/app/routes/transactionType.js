module.exports = function (app) {

	var api = app.api.transactionType;

	app.route('/transactionType')
		.get(api.list)
		.post(api.insert);

	app.route('/transactionType/:id')
		.get(api.findById)
		.put(api.update)
		.delete(api.delete);
};