'use strict';

module.exports = () => {

    const nodemailer = require('nodemailer');

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'dynaclub.mailer@gmail.com',
            pass: ''
        }
    });

    /*
    let transporter = nodemailer.createTransport({
        auth: {
            user: '',
            pass: ''
        },
        host: '',
        port: 25,
        secure: false
    });
    */

    return transporter;

}