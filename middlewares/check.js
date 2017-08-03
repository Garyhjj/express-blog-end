var jwt = require('jsonwebtoken');
var config = require('config-lite')({});
var conv = require('chinese-conv');

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
  },

  checkComment: function (req, res, next){
    let comment = req.body;
    if(comment.author != conv.tify(config.author) && comment.author != conv.sify(config.author)) {
      next();
    } else {
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
  }
};
