const mongoose = require('mongoose');

const schema = mongoose.Schema({

	name: {
		type: String,
		required: true,
		index: {
			unique: true
		}
	},
	active: {
		type: Boolean,
		required: true
	}

});

mongoose.model('Team', schema);