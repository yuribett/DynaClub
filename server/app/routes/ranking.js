module.exports = app => {

	let api = app.api.ranking;

	app.route('/api/ranking/:team/:sprint')
		.get(api.list)
};