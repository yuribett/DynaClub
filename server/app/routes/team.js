module.exports = function(app) {

	var api = app.api.team;

    console.log('>>>>');
    console.log(api.list);

/*
	app.route('/transaction')
		.post(api.insert);

	app.route('/transaction/:id')
		.get(api.findById)
		.delete(api.delete)
		.put(api.update);
*/

    app.route('/team/')
        .get(api.list);
        
};