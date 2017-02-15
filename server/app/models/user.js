var mongoose = require('mongoose');

var schema = mongoose.Schema({

	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	user: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 15,
		index: {
			unique: true
		}
	},
	password: {
		type: String,
		minlength: 6,
		maxlength: 20,
		required: true
	},
	teams: [{
		type: mongoose.Schema.ObjectId,
		ref: 'Team',
		required: true
	}],
	active: {
		type: Boolean,
		required: true
	},
	admin: {
		type: Boolean,
		required: true
	}

});

mongoose.model('User', schema);