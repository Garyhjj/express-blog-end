var config = require('config-lite')({});
var Mongolass = require('mongolass');
var mongolass = new Mongolass();
var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');
mongolass.connect(config.mongodb);

mongolass.plugin('addCreatedAt', {
  afterFind: function (results) {
    results.forEach(function (item) {
      item.create_at = objectIdToTimestamp(item._id);
    });
    return results;
  },
  afterFindOne: function (result) {
    if (result) {
      result.create_at = objectIdToTimestamp(result._id);
    }
    return result;
  }
});

exports.User = mongolass.model('User', {
  name: { type: 'string' },
  password: { type: 'string' },
  avatar: { type: 'string' },
  gender: { type: 'string', enum: ['m', 'f', 'x'] },
  bio: { type: 'string' }
});
exports.User.index({ name: 1 }, { unique: true }).exec();

exports.Article = mongolass.model('Article', {
  author: { type: 'string' },
  title: { type: 'string' },
  content: { type: 'string' },
  label: { type: 'string'},
  type: { type: 'string'}
});

exports.Article.index({ author: 1, _id: -1 }).exec();// 按创建时间降序查看用户的文章列表

exports.Comment = mongolass.model('Comment', {
  author: { type: Mongolass.Types.ObjectId },
  content: { type: 'string' },
  postId: { type: Mongolass.Types.ObjectId }
});
exports.Comment.index({ postId: 1, _id: 1 }).exec();// 通过文章 id 获取该文章下所有留言，按留言创建时间升序
exports.Comment.index({ author: 1, _id: 1 }).exec();// 通过用户 id 和留言 id 删除一个留言
