module.exports = function(app) {

	var api = app.api.transaction;

/*
	app.route('/transaction')
		.post(api.insert);

	app.route('/transaction/:id')
		.get(api.findById)
		.delete(api.delete)
		.put(api.update);
*/

    app.route('/transaction/:user')
        .get(api.listByUser);

	app.route('/transaction')
		.post(api.insert);
        
};