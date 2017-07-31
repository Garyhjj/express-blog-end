var express = require('express');
var router = express.Router();
var ArticleModel = require('../models/article');
var querystring = require('querystring');

router.get('/', function(req, res, next) {
    console.log(req.query);
    let page = req.query.page || 1;
    ArticleModel.getArticles('黄嘉骏').then((articles) => {
      let result = {
        page:page,
        total:articles.length,
        articles:articles.slice((page-1)*2,page*2)
      }
      res.send(result);
    });

});
router.get('/id', function(req, res, next) {
    console.log(req.query);
    let id = req.query._id;
    if(id) {
      ArticleModel.getArticleById(id).then((article) => {
        res.send({article:article});
      }).catch((err) => console.log(err))
    } else {
      res.send(null);
    }
});
module.exports = router;
