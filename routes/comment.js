var express = require('express');
var router = express.Router();
var commentModel = require('../models/comments');
var objectIdToTimestamp = require('objectid-to-timestamp');
var marked = require('marked');
var check = require('../middlewares/check');

router.get('/', function(req, res, next) {
    let target = req.query.articleId;
    commentModel.getComments(target).then((com) => {
      res.send(com);
    })
});

router.post('/create', check.checkComment, function(req, res, next){
  let comment = req.body;
  commentModel.create(comment).then((com) => {
    let newCom = com.ops[0];
    newCom.create_at = objectIdToTimestamp(newCom._id);
    newCom.content = newCom.content.replace(/script/g,"```"+"script"+"```");
    newCom.content = marked(newCom.content);
    res.send(newCom);
  });
});

module.exports = router;
