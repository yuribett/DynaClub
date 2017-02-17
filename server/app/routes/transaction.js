module.exports = app => {

    let api = app.api.transaction;

    app.route('/api/transaction/:user/:team')
        .get(api.listByUser);

    app.route('/api/wallet/:user/:team')
        .get(api.getWallet);

    app.route('/api/transaction')
        .post(api.insert);

};