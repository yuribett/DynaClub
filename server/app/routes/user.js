module.exports = function(app) {

	var api = app.api.user;

    app.route('/user')
        .get(api.list)
        .post(api.insert);
        
};