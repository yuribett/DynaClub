'use strict';

module.exports = () => {

    let cron = require('node-cron');

    var task = cron.schedule('* * * * *', function () {
        let transporter = require('../../../config/mailer')();
        let template = require('./templates/test.js')();


        console.log(template);

        // setup email data with unicode symbols

        let mailOptions = {
            from: '"Fred Foo 👻" <foo@teste.com>', // sender address
            to: 'contato@yuribett.com', // list of receivers
            subject: 'Hello ✔', // Subject line
            text: 'What a shame', // plain text body
            html: template // html body
        };


        // send mail with defined transport object
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
        
    }, false);

    //task.start();



}