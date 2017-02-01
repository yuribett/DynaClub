module.exports = function(app) {

	var api = app.api.user;

    app.route('/user')
        .get(api.list)
		.post(api.insert);
    
	app.route('/user/:id')
		.get(api.findById)
        .put(api.update)
		.delete(api.delete);

	app.route('/userTeam/:team')
		.get(api.findByTeam);
        
};