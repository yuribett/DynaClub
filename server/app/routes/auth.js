module.exports = function(app) {

    var api = app.api.auth;
    app.post('/auth', api.authUser);
    //remover
    //app.use('/*', api.verifyToken);
};