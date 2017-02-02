module.exports = function (app) {

	var api = app.api.transaction;

	app.route('/transaction/:user/:team/:sprint')
		.get(api.listByUser);

	app.route('/transaction')
		.post(api.insert);

};