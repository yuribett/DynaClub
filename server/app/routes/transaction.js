module.exports = function(app) {

    var api = app.api.transaction;

    app.route('/transaction/:user/:team/:timeline')
        .get(api.listByUser);

    app.route('/transaction')
        .post(api.insert);

};