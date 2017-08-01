var Article = require('../lib/mongo').Article;
var CommentModel = require('./comments');
// 将 post de content 从 markdown 转换成 html
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

// 给 post 添加留言数 commentsCount
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

module.exports = {
    // 创建一篇文章
    create: function create(post) {
        return Article.create(post).exec();
    },

    // 通过文章 id 获取一篇文章
    getArticleById: function(postId) {
        return Article.findOne({
                _id: postId
            })
            .addCreatedAt()
            .labelToArray()
            .exec();
    },

    // 通过文章 type 获取所有文章
    getArticleByType: function(articleType) {
        return Article.find({
                type: articleType
            })
            .addCreatedAt()
            .labelToArray()
            .exec();
    },

    // 通过文章 label 获取所有文章
    getArticleByLabel: function(articleLabel) {
        return Article.find({
                label: eval("/" + articleLabel + "/")
            })
            .addCreatedAt()
            .labelToArray()
            .exec();
    },

    // 通过关键字 获取所有文章
    getArticleByKey: function(Key) {
        return Article.find({
                $or: [{
                    title: eval("/" + Key + "/")
                }, {
                    content: eval("/" + Key + "/")
                }, {
                    type: eval("/" + Key + "/")
                }, {
                    label: eval("/" + Key + "/")
                }
              ]
            })
            .addCreatedAt()
            .labelToArray()
            .exec();
    },

    // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章页
    getArticles: function getArticles(author) {
        var query = {};
        if (author) {
            query.author = author;
        }
        return Article.find(query)
            .populate({
                path: 'author',
                model: 'User'
            })
            .sort({
                _id: -1
            })
            .addCreatedAt()
            .labelToArray()
            .addCommentsCount()
            .exec();
    },

    // 通过文章 id 给 pv 加 1
    incPv: function incPv(postId) {
        return Article
            .update({
                _id: postId
            }, {
                $inc: {
                    pv: 1
                }
            })
            .exec();
    },

    // 通过文章 ID 获取一篇原生文章（编辑文章）
    getRawArticleById: function getRawArticleById(postId) {
        return Article.findOne({
                _id: postId
            })
            .populate({
                path: 'author',
                model: 'User'
            })
            .exec();
    },

    // 通过用户id 和 文章ID 更新一篇文章
    updateArticleById: function updateArticleById(postId, author, data) {
        return Article.update({
            author: author,
            _id: postId
        }, {
            $set: data
        }).exec();
    },

    // 通过用户 id 和文章 id 删除一篇文章
    delArticleById: function delArticleById(postId, author) {
        return Article.remove({
                author: author,
                _id: postId
            }).exec()
            .then(function(res) {
                // 文章删除后，再删除该文章下的所有留言
                if (res.result.ok && res.result.n > 0) {
                    return CommentModel.delCommentsByArticleId(postId);
                }
            });
    }
};
