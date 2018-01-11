var express = require('express');
var cors = require('cors');
var path = require('path');
var logger = require('morgan');
// var session = require('express-session');
// var MongoStore = require('connect-mongo')(session);
var config = require('config-lite')({});
var bodyParser = require('body-parser');
var pkg = require('./package');
var routes = require('./routes');

var app = express();

app.use(cors());
//设置跨域访问

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// app.use(session({
//   name: config.session.key,// 设置 cookie 中保存 session id 的字段名称
//   secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
//   resave: true,// 强制更新 session
//   saveUninitialized: false,// 设置为 false，强制创建一个 session，即使用户未登录
//   cookie: {
//     maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
//   },
//   store: new MongoStore({// 将 session 存储到 mongodb
//     url: config.mongodb// mongodb 地址
//   })
// }));

routes(app);


app.listen(config.port, function() {
    console.log(`${pkg.name} listening on port ${config.port}`);
});
