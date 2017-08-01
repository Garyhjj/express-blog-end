var express = require('express');
var router = express.Router();
var commentModel = require('../models/comments');

router.get('/', function(req, res, next) {
    commentModel.create({
      author: 'hhh',
      url: '',
      email: '',
      reply: 'aaa',
      content: 'hello,good',
      articleId: '597ec03def7a201b70bfb39a'
    }).then((comment) => {
      console.log(comment);
    });
    commentModel.getComments('597ec03def7a201b70bfb39a').then((com) => {
      res.send(com)
    })

});

module.exports = router;
