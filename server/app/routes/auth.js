module.exports = function(app) {

    var api = app.api.auth;
    app.post('/autenticar', api.autentica);
    app.use('/*', api.verificaToken);
};