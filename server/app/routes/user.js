module.exports = app => {

	let api = app.api.user;
	let auth = app.api.auth;

	/**
	 * TODO user admin
	 */
	//app.route('/api/user')
	//	.get(api.list)
	//	.post(api.insert);

	app.route('/api/user/:id')
		.get(api.findById)
		.put(auth.guardOwner(api.update, 'id'))
		.delete(auth.guardOwner(api.delete, 'id'));

	app.route('/api/userTeam/:team')
		.get(api.findByTeam);

};