var mongoose = require('mongoose');

var schema = mongoose.Schema({

	from: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	},
	to: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	},
	requester: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	amount: {
		type: Number,
		required: true
	},
	message: {
		type: String,
		required: false
	},
	team: {
		type: mongoose.Schema.ObjectId,
		ref: 'Team',
		required: true
	},
	sprint: {
		type: mongoose.Schema.ObjectId,
		ref: 'Sprint',
		required: true
	},
	transactionType: {
		type: mongoose.Schema.ObjectId,
		ref: 'TransactionType',
		required: true	
	},
	status: {
		type: Number,
		required: true,
		default: 0
	}
});

mongoose.model('Transaction', schema);