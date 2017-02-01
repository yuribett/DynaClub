var mongoose = require('mongoose');

module.exports = function(app) {

    var api = {};

    var model = mongoose.model('Transaction');


    api.listByUser = function(req, res) {
        let user = req.params.user;
        let team = req.params.team;
        let sprint = req.params.sprint;
        model.find({
                $or: [
                    { 'to': user },
                    { 'from': user }
                ],
                'team': team,
                'sprint': sprint
            })
            .populate('to from, sprint')
            .then(function(transactions) {
                res.json(transactions);
            }, function(error) {
                console.log(error);
                res.sendStatus(500);
            });

    };


    api.insert = function(req, res) {
        model.create(req.body)
            .then(function(transaction) {
                res.json(transaction);
            }, function(error) {
                console.log('cannot insert transaction');
                console.log(error);
                res.sendStatus(500);
            });
    };

    /*
        api.findById = function(req, res) {
    		
    	};

    	api.insert = function(req, res) {
    		
    	};

        api.update = function(req, res) {
    		
    	};

        api.delete = function(req, res) {
    		
    	};
    */
    return api;
};