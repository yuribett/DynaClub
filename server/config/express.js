var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var path = require('path');
var morgan = require('morgan');
var logger = require('../app/services/logger.js');
var app = express();

app.set('secret', '3mG!pYBa8#5r1J6');

app.use(morgan("common", {
	stream: {
		write: function (mensagem) {
			logger.info(mensagem);
		}
	}
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Expose-Headers", "x-access-token");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, X-XSRF-TOKEN, Authorization, Content-Type, Accept");
	res.header("Access-Control-Allow-Credentials", "true");
	
	if ('OPTIONS' === req.method) {
		res.sendStatus(200);
	} else {
		next();
	}

});

//TODO project still in dev mode
//app.use(express.static('../client/dist/'));

consign({ cwd: 'app' })
	.include('models')
	.then('api')
	.then('routes/auth.js')
	.then('routes')
	.then('services')
	.into(app);

module.exports = app;
