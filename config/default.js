module.exports = {
  port: 7100,
  // session: {
  //   secret: 'hjj',
  //   key: 'myBlog',
  //   maxAge: 1000*60*10
  // },
  mongodb: 'mongodb://localhost:27017/ng4-blog',
  jwt: {
    secret:'myBlogjj'
  },
  author:'黄嘉骏',
  articles:{
    onePage:7 // 一页显示多少条文章
  }
};
