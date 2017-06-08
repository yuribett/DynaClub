let logger = require('../app/services/logger.js');

module.exports = () => {
    let cron = require('node-cron');

    var task = cron.schedule('* * * * *', function () {
        console.log('immediately started');
    }, false);

    //task.start();

    return cron;
};