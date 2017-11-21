var express = require('express');
var config = require('config-lite')({});
var router = express.Router();
var UserModel = require('../models/users');
var sha1 = require('sha1');
// var multer = require('multer');
var jwt = require('jsonwebtoken');
var checkLogin = require('../middlewares/check').checkLogin;
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/user/photo');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }
// });
//
// var upload = multer({ storage: storage });
// router.get('/', function(req, res, next) {
//
//   UserModel.create({
//     accountName:'garyhjj',
//     password: sha1('123456')
//   }).then((data) => {
//     console.log(data);
//     res.send(data)
//   });
//
// });

router.post('/', function(req, res, next) {
  var accountName = req.body.accountName;
  var password = req.body.password;
  UserModel.getUserByName(accountName).then(function(user){
    if(!user){
      res.status(404);
      res.send('没有此用户');

    }else {
      if(sha1(password) !== user.password ){
        res.status(404);
        res.send('密码或账号名错误');
      }else{
        var token = jwt.sign({
          accountName: accountName
        }, config.jwt.secret, { expiresIn: 60*30 });//是以秒为单位
        res.json({user:user,token:config.jwt.scheme +' ' + token});
      }
    }
  });
});

// router.post('/update', checkLogin, function(req, res, next) {
//   var accountName = jwt.verify(req.headers.authorization,config.jwt.secret).accountName;
//   var data = req.body.data;
//   if(data.mobile){
//     data.mobile = +data.mobile;
//   }
//   UserModel.updateDetailById(accountName,data).then(function(user){
//     if(!user){
//       res.json({isPass:false,error:'账号不存在'});
//
//     }else {
//         res.json({isPass:true});
//     }
//   });
// });
//
// router.post('/update/picture', upload.array('file', 1), function(req, res, next) {
//   console.log(req.body.accountName);
//   console.log(req.files[0].filename);
//   console.log(req.headers.authorization);
//   UserModel.updateDetailById(req.body.accountName,{photo: 'user/photo/' + req.files[0].filename}).then(function(user) {
//     if(!user){
//       res.json({isPass:false,error:'账号不存在'});
//
//     }else {
//         res.json({isPass:true});
//         console.log('done');
//     }
//   });
// });

module.exports = router;
