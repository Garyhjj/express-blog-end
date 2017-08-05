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
  comment.status = req.isAdmin? 0 : 1;
  console.log(req.isAdmin);
  commentModel.create(comment).then((com) => {
    let newCom = com.ops[0];
    newCom.create_at = objectIdToTimestamp(newCom._id);
    newCom.content = newCom.content.replace(/script/g,"```"+"script"+"```");
    newCom.content = marked(newCom.content);
    res.send(newCom);
  });
});

router.get('/unreadCount', check.checkLogin, function(req, res, next) {
    commentModel.getNewCommentsCount().then((count) => {
      res.send({count:count});
    });
});

router.get('/newComments', check.checkLogin, function(req, res, next) {
    commentModel.getNewComments().then((coms) => {
      res.send(coms);
    });
});
router.get('/readed', check.checkLogin, function(req, res, next) {
    let articleId = req.query.id;
    if(!articleId) {
      res.status(404);
      res.send('没参数');
    } else {
      commentModel.readNewCommentsByArticleId(articleId).then((status) => {
        res.send(status);
      });
    }
});

module.exports = router;
