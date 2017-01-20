module.exports = function(app) {

    var api = app.api.auth;
    app.post('/auth', api.authUser);
    //app.use('/*', api.verifyToken);
};