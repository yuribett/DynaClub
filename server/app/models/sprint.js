var mongoose = require('mongoose');

var schema = mongoose.Schema({

    dateStart : {
        type: Date, 
        required: true
    },
    dateFinish : {
        type: Date, 
        required: true
    },
    initialAmount : {
        type: Number, 
        required: false
    }

});

mongoose.model('Sprint', schema);