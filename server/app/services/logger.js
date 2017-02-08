let winston = require('winston');
let fs = require('fs');

if (!fs.existsSync('logs')) {
	fs.mkdirSync('logs');
}

module.exports = new winston.Logger({
	transports: [
		new winston.transports.File({
			level: "debug",
			filename: "logs/dynaclub.log",
			maxsize: 10000,
			maxFiles: 100
		})
	]
});
