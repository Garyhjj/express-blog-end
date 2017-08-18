var Comment = require('../lib/mongo').Comment;
var marked = require('marked');

// 将 comment 的 content 从 markdown 转换成 html
Comment.plugin('contentToHtml', {
  afterFind: function (comments) {
    return comments.map(function (comment) {
      comment.content = comment.content.replace(/script/gi,"```"+"script"+"```");
      comment.content = marked(comment.content);
      return comment;
    });
  }
});

module.exports = {
  // 创建一个留言
  create: function create(comment) {
    return Comment.create(comment).exec();
  },



  // 通过文章 id 获取该文章下所有留言，按留言创建时间升序
  getComments: function(articleId) {
    return Comment
      .find({ articleId: articleId })
      .sort({ _id: 1 })
      .addCreatedAt()
      .contentToHtml()
      .exec();
  },

  // 通过文章 id 获取该文章下留言数
  getCommentsCount: function(articleId) {
    return Comment.count({ articleId: articleId }).exec();
  },

  // 获得新留言的数目
  getNewCommentsCount: function() {
    return Comment.count({ status: 1 }).exec();
  },

  // 获得所有新留言,按留言创建时间降序
  getNewComments: function() {
    return Comment.find({ status: 1 })
                  .sort({ _id: -1 })
                  .addCreatedAt()
                  .contentToHtml()
                  .exec();
  },

  // 根据文章id将所有未读消息改成已读
  readNewCommentsByArticleId: function(id) {
    return Comment.update({articleId:id,status:1},{$set:{status:0}},{multi:true}).exec();
  },


};
