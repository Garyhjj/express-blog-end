var express = require('express');
var router = express.Router();
var ArticleModel = require('../models/article');
var querystring = require('querystring');
var moment = require('moment');
var check = require('../middlewares/check');
var config = require('config-lite')({});
var passport = require('../passport');

router.get('/', function(req, res, next) {
    let page = req.query.page || 1;
    Promise.all([ArticleModel.getArticlesByPage(page),ArticleModel.getArticlesCount()]).then((artMes) => {
      let result = {
          onePage: config.articles.onePage,
          page: page,
          total: artMes[1],
          articles: artMes[0]
      };
      res.send(result);
    });
});
router.delete('/', check.checkLogin, function(req, res, next) {
  let id = req.query.id;
  if(!id) {
    res.send(404);
  }
  ArticleModel.deleteArticleById(id).then((result) => {
    if(result.result.n === 0) {
      res.send(404);
    }
    res.send(200);
  });

});
router.post('/create', check.checkLogin, function(req, res, next) {
    ArticleModel.create(req.body).then((arti) => {
        res.send(arti.ops[0]);
    });
});
router.post('/update', passport.authenticate('jwt', { session: false }), function(req, res, next) {
    let article = req.body;
    ArticleModel.updateArticle(article).then((status) => {
        res.send(status);
    });
});
router.get('/id', function(req, res, next) {
    let id = req.query._id;
    if (id) {
        ArticleModel.getArticleById(id).then((article) => {
            res.send({
                article: article
            });
        }).catch((err) => console.log(err))
    } else {
        res.send(null);
    }
});
router.get('/original', function(req, res, next) {
    let id = req.query._id;
    if (id) {
        ArticleModel.getOriginalArticleById(id).then((article) => {
            if (!article) {
                res.status(404);
            }
            res.send(article);
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
    Promise.all([ArticleModel.getArticleByType(type,page),ArticleModel.getArticlesCount({
      type:type
    })]).then((artMes) => {
      res.send({
          onePage: config.articles.onePage,
          page: page,
          articles: artMes[0],
          total: artMes[1]
      });
    });
});

router.get('/label', function(req, res, next) {
    let label = req.query.label;
    let page = req.query.page;
    Promise.all([ArticleModel.getArticleByLabel(label,page),ArticleModel.getArticlesCount({
      label:eval("/" + label + "/")
    })]).then((artMes) => {
      let arts = artMes[0].filter((art) => {
          return art.label.indexOf(label) > -1;
      });
      res.send({
          onePage: config.articles.onePage,
          page: page,
          articles: arts,
          total: artMes[1]
      });
    });
});

router.get('/date', function(req, res, next) {
    let date = req.query.date;
    let page = req.query.page;
    ArticleModel.getArticles().then((articles) => {
        articles = articles.filter((art) => {
            return Date.parse(moment(art.create_at).format('YYYY-MM-01')) === +date
        });
        let art = sendArticlesByPage(articles, page, config.articles.onePage);
        res.send({
            onePage: config.articles.onePage,
            page: page,
            articles: art,
            total: articles.length
        });
    });
});

router.get('/key', function(req, res, next) {
    let key = req.query.key;
    let page = req.query.page;
    ArticleModel.getArticleByKey(key).then((articles) => {
        let art = sendArticlesByPage(articles, page, config.articles.onePage);
        res.send({
            onePage: config.articles.onePage,
            page: page,
            articles: art,
            total: articles.length
        });
    });
});

function sendArticlesByPage(art, pageNum, pageSize) {
    let _pageSize = pageSize || 5;
    let _pageNum = pageNum || 1;
    return art.slice((_pageNum - 1) * _pageSize, _pageNum * _pageSize);

}

function conclude(res) {
    let detail = {
        type: {

        },
        label: {

        },
        date: {

        }
    };
    ArticleModel.getArticles().then((articles) => {
        articles.forEach((art) => {
            detail.type[art.type] = detail.type[art.type] ? detail.type[art.type] + 1 : 1;
            art.label.forEach((label) => {
                detail.label[label] = detail.label[label] ? detail.label[label] + 1 : 1;
            });

            let art_date = Date.parse(moment(art.create_at).format('YYYY-MM-01'));
            detail.date[art_date] = detail.date[art_date] ? detail.date[art_date] + 1 : 1;
        });
        let format = {};
        for (let prop in detail) {
            format[prop] = format[prop] || [];
            for (let sub in detail[prop]) {
                format[prop].push({
                    name: sub,
                    num: detail[prop][sub]
                });
            }
        }
        format.lastest = articles.slice(0, 7);
        res && res.send(format);
    });
}
module.exports = router;
