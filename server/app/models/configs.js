var mongoose = require('mongoose');

var schema = mongoose.Schema({

    dynasMonthly : {
        type: Number, 
        required: true
    }

});

mongoose.model('Configs', schema);