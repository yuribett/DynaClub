const ejs = require('ejs');
const fs = require('fs');
const transporter = require('../../config/mailer')();

const sender = {

    donationSent(transaction) {
        
        const str = fs.readFileSync('app/mailer/templates/got-a-donnation.ejs', 'utf8');

        let template = ejs.render(str, { value : transaction.amount, from : transaction.from.name });

        console.log(template);

        // setup email data with unicode symbols
        let mailOptions = {
            from: `"${transaction.from.name}" <${transaction.from.email}>`, // sender address
            to: `${transaction.to.email}`, // list of receivers
            subject: `Você acaba de receber Dynas de ${transaction.from.name}`, // Subject line
            //text: '', // plain text body
            html: template // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
        });

    }
}

module.exports = sender;