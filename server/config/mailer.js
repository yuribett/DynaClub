'use strict';

module.exports = (mailerUser, mailerPassword) => {

    const nodemailer = require('nodemailer');

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: mailerUser,
            pass: mailerPassword
        }
    });

    return transporter;

}