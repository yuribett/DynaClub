module.exports = function(app) {

	var api = app.api.user;

    console.log(api.list);

    app.route('/user')
        .get(api.list);
        
};