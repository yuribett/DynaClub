var mongoose = require('mongoose');

var schema = mongoose.Schema({

	description: {
		type: String,
		required: true
	}

});

mongoose.model('TransactionType', schema);