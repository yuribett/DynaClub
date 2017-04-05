'use strict';

module.exports = () => {

    const nodemailer = require('nodemailer');

    // create reusable transporter object using the default SMTP transport
    /*
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'dynaclub.mailer@gmail.om',
            pass: '3mG!pYBa8#5r1J6'
        }
    });
    */

    let transporter = nodemailer.createTransport({
        auth: {
            user: '',
            pass: ''
        },
        host: '',
        port: 25,
        secure: false
    });



    // setup email data with unicode symbols
    /*
    let mailOptions = {
        from: '"Fred Foo 👻" <foo@teste.com>', // sender address
        to: 'contato@yuribett.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world ?', // plain text body
        html: '<b>Hello world ?</b>' // html body
    };
    */

    // send mail with defined transport object
    /*
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
    */

    return transporter;

}