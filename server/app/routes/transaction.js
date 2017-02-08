module.exports = app => {

	let api = app.api.transaction;

	app.route('/api/transaction/:user/:team/:sprint')
		.get(api.listByUser);

	app.route('/api/transaction')
		.post(api.insert);

};