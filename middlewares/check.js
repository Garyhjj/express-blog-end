var jwt = require('jsonwebtoken');
var config = require('config-lite')({});
var conv = require('chinese-conv');
var scheme = config.jwt.scheme;

module.exports = {
  checkLogin: function checkLogin(req, res, next){
    var token = req.headers.authorization || '';
    jwt.verify(token.slice(scheme.length+1),config.jwt.secret, function(err, decoded) {
      if(err){
        res.status(401);
        res.send('token已超时');
      }else {
        next();
      }
    });
  },

  checkComment: function (req, res, next){
    var token = req.headers.authorization || '';
    jwt.verify(token.slice(scheme.length+1),config.jwt.secret, function(err, decoded) {
      if(err){
        let comment = req.body;
        if(comment.author != conv.tify(config.author) && comment.author != conv.sify(config.author)) {
          next();
        } else {
          res.status(401);
          res.send('游客不能使用作者名称');
        }
      }else {
        req.isAdmin = true;
        next();
      }
    });
  }
};
