var mongoose = require('mongoose');

var schema = mongoose.Schema({

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