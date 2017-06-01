const ejs = require('ejs');
const fs = require('fs');
const transporter = require('../../config/mailer')();
const logger = require('../services/logger.js');

const sender = {

    donationSent(transaction) {

        const str = fs.readFileSync('app/mailer/templates/got-a-donnation.ejs', 'utf8');
        const template = ejs.render(str, { value: transaction.amount, from: transaction.from.name });

        send({
            from: `"${transaction.from.name}" <${transaction.from.email}>`,
            to: `${transaction.to.email}`,
            subject: `Você acaba de receber Dynas de ${transaction.from.name}`,
            html: template
        });
    }
}

const send = (options) => {

    transporter.sendMail(options, (error, info) => {
        if (error) {
            return console.log(error);
        }
        logger.info(info);
    });

}

module.exports = sender;