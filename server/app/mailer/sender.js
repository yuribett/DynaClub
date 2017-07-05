const ejs = require('ejs');
const fs = require('fs');
const logger = require('../services/logger.js');

module.exports = (user, password) => {

    const transporter = require('../../config/mailer')(user, password);
    const sender = {};

    sender.donationSent = transaction => {

        const str = fs.readFileSync('app/mailer/templates/got-a-donnation.ejs', 'utf8');
        const template = ejs.render(str, { value: transaction.amount, from: transaction.from.name });

        send({
            from: `"${transaction.from.name}" <${transaction.from.email}>`,
            to: `${transaction.to.email}`,
            subject: `DynaClub: Dynas recebidos de ${transaction.from.name}`,
            html: template

        });
    };

    sender.requestSent = transaction => {

        const str = fs.readFileSync('app/mailer/templates/got-a-request.ejs', 'utf8');
        const template = ejs.render(str, { value: transaction.amount, to: transaction.to.name });

        send({
            from: `"${transaction.to.name}" <${transaction.to.email}>`,
            to: `${transaction.from.email}`,
            subject: `DynaClub: Pedido de Dynas de ${transaction.to.name}`,
            html: template
        });
    };

    sender.requestAccepted = transaction => {

        const str = fs.readFileSync('app/mailer/templates/accepted-request.ejs', 'utf8');
        const template = ejs.render(str, { value: transaction.amount, from: transaction.from.name });

        send({
            from: `"${transaction.from.name}" <${transaction.from.email}>`,
            to: `${transaction.to.email}`,
            subject: `DynaClub: ${transaction.from.name} aceitou seu pedido`,
            html: template
        });
    };

    sender.requestDenied = transaction => {

        const str = fs.readFileSync('app/mailer/templates/denied-request.ejs', 'utf8');
        const template = ejs.render(str, { value: transaction.amount, from: transaction.from.name });

        send({
            from: `"${transaction.from.name}" <${transaction.from.email}>`,
            to: `${transaction.to.email}`,
            subject: `DynaClub: ${transaction.from.name} negou seu pedido`,
            html: template
        });
    }

    const send = options => {
        transporter.sendMail(options, (error, info) => {
            if (error) {
                logger.error(error);
                return;
            }
            logger.info(info);
        });
    }

    return sender;
}
