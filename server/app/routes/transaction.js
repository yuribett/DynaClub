module.exports = app => {

	let api = app.api.transaction;

	app.route('/transaction/:user/:team/:sprint')
		.get(api.listByUser);

	app.route('/transaction')
		.post(api.insert);

};