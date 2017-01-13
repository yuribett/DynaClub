module.exports = function(app) {

	var api = app.api.configs;

    app.route('/configs')
        .get(api.list);
        
};