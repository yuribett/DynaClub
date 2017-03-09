let mongoose = require('mongoose');
let logger = require('../services/logger.js');

module.exports = app => {

    let api = {};

    let model = mongoose.model('Transaction');

    api.list = (req, res) => {
        let teamID = req.params.team;
        let sprintID = req.params.sprint;
        model.aggregate(
            [
                {
                    $match: {
                        'sprint': mongoose.Types.ObjectId(sprintID),
                        'team': mongoose.Types.ObjectId(teamID)
                    }
                },
                {
                    $group:
                    {
                        _id: "$to",
                        totalAmount: { $sum: "$amount" },
                        to: {$first: '$to'},
                        count: { $sum: 1 }
                    }
                }
                
                
                ,{
                    $lookup:
                        {
                            from: "users",
                            localField: "to",
                            foreignField: "_id",
                            as: "user"
                        }
                }
                
            ]
        )
            .sort({ totalAmount: -1 })
            .then((ranking) => {
                //FIXME remove password
                res.json(ranking);
            }, (error) => {
                console.log(error)
                logger.error(error);
                res.sendStatus(500);
            });
    };

    return api;
};

