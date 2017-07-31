var express = require('express');
var router = express.Router();
var ArticleModel = require('../models/article');


router.post('/', function(req, res, next) {
  console.log(req.body);
    ArticleModel.create(req.body).then((arti) => {
      console.log(arti);
      res.send(arti)
    })
});
module.exports = router;
