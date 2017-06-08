const mongoose = require('mongoose');

const schema = mongoose.Schema({

	description: {
		type: String,
		required: true
	},
	active: {
		type: Boolean,
		required: true
	}

});

mongoose.model('TransactionType', schema);