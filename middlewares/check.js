var jwt = require('jsonwebtoken');
var config = require('config-lite');
module.exports = {
  checkLogin: function checkLogin(req, res, next){
    var token = req.headers.authorization;
    jwt.verify(token,config.jwt.secret, function(err, decoded) {
      if(err){
        res.status(401);
        res.send('token已超时');
      }else {
        next();
      }
    });
  }
};
