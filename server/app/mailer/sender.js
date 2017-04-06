'use strict';

function sendEmail() {
    console.log('... mailer')

    //let cron = require('node-cron');

    //var task = cron.schedule('* * * * *', function () {
        let transporter = require('../../../config/mailer')();

        let ejs = require('ejs')
        , fs = require('fs')
        , str = fs.readFileSync('./templates/shame-one-week.ejs', 'utf8'); 

        let template = ejs.render(str, {});

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Fred Foo 👻" <foo@teste.com>', // sender address
            to: 'yuri@dynamix.com.br', // list of receivers
            subject: 'Hello ✔', // Subject line
            text: 'What a shame', // plain text body
            html: template // html body
        };

        // send mail with defined transport object
        if(false){ // dev mode
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
            });
        } else {
            console.log("ficticius sent: ", template)
        }
        
        
    //}, false);

    //task.start();
}

module.exports = () => sendEmail;