var express = require('express');
var router = express.Router();
var ArticleModel = require('../models/article');
var querystring = require('querystring');
var moment = require('moment');

router.get('/', function(req, res, next) {
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
    let id = req.query._id;
    if(id) {
      ArticleModel.getArticleById(id).then((article) => {
        res.send({article:article});
      }).catch((err) => console.log(err))
    } else {
      res.send(null);
    }
});
router.get('/conclude', function(req, res, next) {
    conclude(res);
});

router.get('/type', function(req, res, next) {
    let type = req.query.type;
    let page = req.query.page;
    ArticleModel.getArticleByType(type).then((articles) => {
      let art = sendArticlesByPage(articles,page,2);
      res.send({
        page:page,
        articles:art,
        total:articles.length
      });
    });
});

router.get('/label', function(req, res, next) {
    let label = req.query.label;
    let page = req.query.page;
    ArticleModel.getArticleByLabel(label).then((articles) => {
      articles = articles.filter((art) => {
        return art.label.indexOf(label) > -1;
      });
      let art = sendArticlesByPage(articles,page,2);
      res.send({
        page:page,
        articles:art,
        total:articles.length
      });
    });
});

router.get('/date', function(req, res, next) {
    let date = req.query.date;
    let page = req.query.page;
    ArticleModel.getArticles('黄嘉骏').then((articles) => {
      articles = articles.filter((art) => {
        return Date.parse(moment(art.create_at).format('YYYY-MM-01')) === +date
      });
      let art = sendArticlesByPage(articles,page,2);
      res.send({
        page:page,
        articles:art,
        total:articles.length
      });
    });
});

router.get('/key', function(req, res, next) {
    let key = req.query.key;
    let page = req.query.page;
    console.log(req.query);
    ArticleModel.getArticleByKey(key).then((articles) => {
      let art = sendArticlesByPage(articles,page,2);
      res.send({
        page:page,
        articles:art,
        total:articles.length
      });
    });
});
function sendArticlesByPage(art,pageNum,pageSize) {
  let _pageSize = pageSize || 5;
  let _pageNum = pageNum || 1;
  return art.slice((_pageNum-1)*_pageSize,_pageNum*_pageSize);

}
function conclude(res) {
  let detail = {
    type:{

    },
    label:{

    },
    date: {

    }
  };
  ArticleModel.getArticles('黄嘉骏').then((articles) => {
    articles.forEach((art) => {
      detail.type[art.type] = detail.type[art.type]? detail.type[art.type]+1:1;
      art.label.forEach((label) => {
        detail.label[label] = detail.label[label]? detail.label[label]+1 : 1;
      });

      let art_date = Date.parse(moment(art.create_at).format('YYYY-MM-01'));
      detail.date[art_date]= detail.date[art_date]? detail.date[art_date]+1 :1;
    });
    let format={};
    for(let prop in detail) {
      format[prop] = format[prop] || [];
      for(let sub in detail[prop]) {
        format[prop].push({name:sub,num:detail[prop][sub]});
      }
    }
    format.lastest = articles.slice(0,7);
    res && res.send(format);
  });
}
module.exports = router;
