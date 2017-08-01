var Comment = require('../lib/mongo').Comment;
// var marked = require('marked');
// 将 comment 的 content 从 markdown 转换成 html
// Comment.plugin('contentToHtml', {
//   afterFind: function (comments) {
//     return comments.map(function (comment) {
//       comment.content = marked(comment.content);
//       return comment;
//     });
//   }
// });

module.exports = {
  // 创建一个留言
  create: function create(comment) {
    return Comment.create(comment).exec();
  },



  // 通过文章 id 获取该文章下所有留言，按留言创建时间升序
  getComments: function getComments(articleId) {
    return Comment
      .find({ articleId: articleId })
      .sort({ _id: 1 })
      .addCreatedAt()
      .exec();
  },

  // 通过文章 id 获取该文章下留言数
  getCommentsCount: function getCommentsCount(articleId) {
    return Comment.count({ articleId: articleId }).exec();
  }
};
