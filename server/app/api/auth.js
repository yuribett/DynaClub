var mongoose = require('mongoose');
var jwt  = require('jsonwebtoken'); 

module.exports = function(app) {

     var api = {};
     var model = mongoose.model('User');

     api.authUser = function(req, res) {
         
         model.findOne({
             user: req.body.user,
             password: req.body.password
         })
         .populate('teams')
         .then(function(auth) {
             if (!auth) {
                 console.log('Login/password incorrect');
                 res.sendStatus(401);
             } else {
                 var token = jwt.sign({auth: auth.user}, app.get('secret'), {
                     expiresIn: 7614000
                 });
                 //setting password to null to response
                 auth.password = null;

                 res.set('x-access-token', token); 
                 res.json(auth);
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