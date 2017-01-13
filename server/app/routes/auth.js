module.exports = function(app) {

    var api = app.api.auth;
    app.post('/auth', api.authUser);
    //TODO
    //app.use('/*', api.verifyToken);
};