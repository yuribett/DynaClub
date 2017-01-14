var mongoose = require('mongoose');
var jwt  = require('jsonwebtoken'); 

module.exports = function(app) {

     var api = {};
     var model = mongoose.model('User');

     api.authUser = function(req, res) {
         console.log('authUser');

         console.log(req.body.password);

         model.findOne({
             user: req.body.user,
             password: req.body.password
         })
         .then(function(auth) {
             if (!auth) {
                 console.log('Login/password incorrect');
                 res.sendStatus(401);
             } else {
                console.log(auth.user)
                 var token = jwt.sign({auth: auth.user}, app.get('secret'), {
                     expiresIn: 7614000
                 });
                 res.set('x-access-token', token); 
                 console.log(token);
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