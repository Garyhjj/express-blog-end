module.exports = function (app) {
  app.get('/', function(req, res) {
      res.send('/posts');
  });
  app.use('/upload/article', require('./upload_article'));
  app.use('/articles', require('./getArticles'));
  app.use('/comment', require('./comment'));
};
