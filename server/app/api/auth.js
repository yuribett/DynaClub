var mongoose = require('mongoose');
var jwt  = require('jsonwebtoken'); 

module.exports = function(app) {

     var api = {};
     var model = mongoose.model('User');

     api.authUser = function(req, res) {

         model.findOne({
             login: req.body.login,
             senha: req.body.senha
         })
         .then(function(usuario) {
             if (!usuario) {
                 console.log('Login/password incorrect');
                 res.sendStatus(401);
             } else {
                console.log(usuario.login)
                 var token = jwt.sign({login: usuario.login}, app.get('secret'), {
                     expiresIn: 84600
                 });
                 res.set('x-access-token', token); 
                 res.end(); 
             }
         });
     };

    api.verifyToken = function(req, res, next) {

         var token = req.headers['x-access-token'];

         if (token) {
             jwt.verify(token, app.get('secret'), function(err, decoded) {
                 if (err) {
                     console.log('Token rejected');
                     return res.sendStatus(401);
                 } else {
                     req.usuario = decoded;    
                     next();
                  }
            });
        } else {
            console.log('Token not sent');
            return res.sendStatus(401);
          }
    }

    return api;
};