var Article = require('../lib/mongo').Article;
var CommentModel = require('./comments');
var marked = require('marked');
var config = require('config-lite')({});

// 将 article 的 content 从 markdown 转换成 html
Article.plugin('contentToHtml', {
    afterFind: function(posts) {
        return posts.map(function(post) {
            post.content = marked(post.content);
            return post;
        });
    },
    afterFindOne: function(post) {
        if (post) {
            post.content = marked(post.content);
        }
        return post;
    }
});
//将 label 内容转换为数组
Article.plugin('labelToArray', {
    afterFind: function(posts) {
        return posts.map(function(post) {
            post.label = post.label.split(',');
            return post;
        });
    },
    afterFindOne: function(post) {
        if (post) {
            post.label = post.label.split(',');
        }
        return post;
    }
});

// 给 article 添加留言数 commentsCount
Article.plugin('addCommentsCount', {
    afterFind: function(posts) {
        return Promise.all(posts.map(function(post) {
            return CommentModel.getCommentsCount(post._id).then(function(commentsCount) {
                post.commentsCount = commentsCount;
                return post;
            });
        }));
    },
    afterFindOne: function(post) {
        if (post) {
            return CommentModel.getCommentsCount(post._id).then(function(count) {
                post.commentsCount = count;
                return post;
            });
        }
        return post;
    }
});
// 给 article 增加前后两条的信息
Article.plugin('addAroundArticle', {
    afterFindOne: function(post) {
        if (post) {
          return Promise.all([Article.find({'_id':{$gt : post._id}}).limit(1),Article.find({'_id':{$lt : post._id}}).sort({_id:-1}).limit(1)])
          .then((res) => {
            post.previous = res[0].length>0?{_id:res[0][0]._id,title:res[0][0].title}:'';
            post.next = res[1].length>0?{_id:res[1][0]._id,title:res[1][0].title}:'';
            return post;
          });
        }
        return post;
    },
    afterFind: function(posts) {
      return Promise.all(posts.map(function(post) {
          return Promise.all([Article.find({'_id':{$gt : post._id}}).limit(1),Article.find({'_id':{$lt : post._id}}).sort({_id:-1}).limit(1)])
          .then((res) => {
            post.previous = res[0].length>0?{_id:res[0][0]._id,title:res[0][0].title}:'';
            post.next = res[1].length>0?{_id:res[1][0]._id,title:res[1][0].title}:'';
            return post;
          });
      }));
    }
});
module.exports = {
    // 创建一篇文章
    create: function create(post) {
        return Article.create(post).exec();
    },

    // 通过_id 删除文章
    deleteArticleById: function(_id) {
      return Article.remove({_id:_id}).exec();
    },

    // 通过条件way获得文章总数
    getArticlesCount: function(way) {
      way = way || {};
      return Article.count(way).exec();
    },

    // 通过文章 id 获取一篇文章
    getArticleById: function(postId) {
        return Article.findOne({
                _id: postId
            })
            .addCreatedAt()
            .contentToHtml()
            .labelToArray()
            .addAroundArticle()
            .exec();
    },

    // 分页获取文章
    getArticlesByPage: function(page) {
      let limit = config.articles.onePage;
      return Article.find().sort({_id:-1}).skip((page-1)*limit).limit(limit)
              .addCreatedAt()
              .contentToHtml()
              .labelToArray()
              .addCommentsCount()
              .addAroundArticle()
              .exec();
    },

    // 通过文章 id 获取一篇文章
    getOriginalArticleById: function(postId) {
        return Article.findOne({
                _id: postId
            })
            .exec();
    },

    // 获得所有文章
    getArticles: function() {
        return Article.find().sort({_id:-1})
            .addCreatedAt()
            .labelToArray()
            .exec();
    },

    //  更新文章
    updateArticle: function(post) {
        return Article.save(post)
            .exec();
    },

    // 通过文章 type 获取所有文章
    getArticleByType: function(articleType,page) {
        let limit = config.articles.onePage;
        return Article.find({
                type: articleType
            }).sort({_id:-1}).skip((page-1)*limit).limit(limit)
            .addCreatedAt()
            .contentToHtml()
            .labelToArray()
            .addCommentsCount()
            .addAroundArticle()
            .exec();
    },

    // 通过文章 label 获取所有文章
    getArticleByLabel: function(articleLabel,page) {
        let limit = config.articles.onePage;
        return Article.find({
                label: eval("/" + articleLabel + "/")
            }).sort({_id:-1}).skip((page-1)*limit).limit(limit)
            .addCreatedAt()
            .contentToHtml()
            .labelToArray()
            .addCommentsCount()
            .addAroundArticle()
            .exec();
    },

    // 通过关键字 获取所有文章
    getArticleByKey: function(Key) {
        return Article.find({
                $or: [{
                    title: eval("/" + Key + "/i")
                }, {
                    content: eval("/" + Key + "/i")
                }, {
                    type: eval("/" + Key + "/i")
                }, {
                    label: eval("/" + Key + "/i")
                }
              ]
            })
            .addCreatedAt()
            .contentToHtml()
            .labelToArray()
            .addCommentsCount()
            .addAroundArticle()
            .exec();
    },

};
