module.exports = function (app) {
  app.get('/', function(req, res) {
      res.send('/posts');
  });
  app.use('/articles', require('./articles'));
  app.use('/comments', require('./comment'));
  app.use('/users', require('./user'));
};
