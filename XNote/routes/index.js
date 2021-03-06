var express = require('express');
var router = express.Router();
var crypto = require('crypto'),
    User = require('../models/users.js'),
    Post = require('../models/Post.js');
var UserController = require('../controllers/userController');
var NoteController = require('../controllers/noteController');

router.get('/',checkIsLogin);
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
      title: '夕夕的日记本',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
  });
});

router.post('/',UserController.login);

router.get('/register',checkIsLogin);
router.get('/register',function(req,res){
    res.render('register',{
        title:'注册',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});
router.post('/register',UserController.register);

router.route('/captcha.png').get(function(req,res){
    var captchapng = require('captchapng');
    if(req.url.indexOf('/captcha.png')==0) {
        var num = parseInt(Math.random()*9000+1000);
        var p = new captchapng(80,30,num); // width,height,numeric captcha
        p.color(0, 0, 0, 0);  // First color: background (red, green, blue, alpha)
        p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
        req.session.captcha = num;
        var img = p.getBase64();
        var imgbase64 = new Buffer(img,'base64');
        res.writeHead(200, {
            'Content-Type': 'image/png'
        });
        res.end(imgbase64);
    } else res.end('');
console.log('Web server started.\n http:\\\\127.0.0.1:8181\\captcha.png');
});

router.get('/home',checkLogin);
router.get('/home', NoteController.getNoteList);

router.get('/detail*',checkLogin);
router.get('/detail*', NoteController.getNoteDetailById);

router.get('/post',checkLogin);
router.get('/post', function(req, res) {

    res.render('post', { 
        title: '发布日记', 
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });

});

router.post('/post', checkLogin);
router.post('/post', NoteController.addNote);

router.get('/logout',checkLogin);
router.get('/logout',function(req,res){
    req.session.user = null;
    console.log('aa');
    req.flash('success','注销成功！');
    res.redirect('/');
   
});

/**
 * [checkLogin 判断是否登录]
 * @param  {[type]}   req  [request]
 * @param  {[type]}   res  [response]
 * @param  {Function} next [继续执行]
 */
function checkLogin(req, res, next){
    console.log("check1");
    if(!req.session.user){
        req.flash('error', '未登录！');
        res.redirect('/');
    }
    next();
}
/**
 * [checkIsLogin 判断是否已经登录]
 * @param  {[type]}   req  [request]
 * @param  {[type]}   res  [response]
 * @param  {Function} next [继续执行]
 */
function checkIsLogin(req, res, next){
    console.log("check2");
    if(req.session.user != null){
        req.flash('error', '已登录！');
        res.redirect('/home');
    }
    next();
}

/**
 * [judgeNamePassword 判断用户输入是否合法]
 * @param  {[type]} req      [request]
 * @param  {[type]} res      [response]
 * @param  {[type]} username [用户名]
 * @param  {[type]} password [密码]
 * @param  {[type]} url      [跳转地址]
 */
function judgeNamePassword(req,res,username,password,url){
	var regEx = /^[a-zA-Z0-9_]{3,20}$/;
	if(!regEx.test(username)){
		req.flash('error','用户名长度为3-20，只能是字母、数字、下划线的组合');
		return res.redirect(url);
	}

	var judge =  (/[a-z]/.test(password)&& /[A-Z]/.test(password) && /[0-9]/.test(password));
    if(!judge){
    	req.flash('error','密码长度不少于6，必须同时包含数字、小写字母、大写字母');
        return res.redirect(url);
    }
}

module.exports = router;

