module.exports = {
  port: 7100,
  session: {
    secret: 'hjj',
    key: 'myBlog',
    maxAge: 1000*60*10
  },
  mongodb: 'mongodb://localhost:27017/ng4-blog',
  jwt: {
    secret:'myBlog'
  }
};
