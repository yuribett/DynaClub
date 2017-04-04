module.exports = app => {

    let api = app.api.transaction;
	let auth = app.api.auth;

    app.route('/api/transaction/:user/:team/:sprint')
        .get(auth.guardOwner(api.listByUser));

    app.route('/api/wallet/:user/:team')
        .get(auth.guardOwner(api.getWallet));

    app.route('/api/transaction')
        .post(api.insert)       
		.put(api.update);

};