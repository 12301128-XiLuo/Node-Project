var express = require('express');
var router = express.Router();
var crypto = require('crypto'),
    User = require('../models/users.js'),
    Post = require('../models/Post.js');

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

router.post('/',function(req,res){
    var email =  req.body.email;
    var password = req.body.password;
    //正则判断用户名
    var regEx = /^[a-zA-Z0-9_]{3,20}$/;
	if(!regEx.test(email)){
		req.flash('error','用户名长度为3-20，只能是字母、数字、下划线的组合');
		return res.redirect('/');
	}

	var judge =  (/[a-z]/.test(password)&& /[A-Z]/.test(password) && /[0-9]/.test(password));
    if(!judge){
    	req.flash('error','密码长度不少于6，必须同时包含数字、大小写字母');
        return res.redirect('/');
    }

    var md5 = crypto.createHash('md5');
    password = md5.update(password).digest('hex');

    User.get(email, function (err, user) {
        if (!user) {
          req.flash('error', '用户不存在!'); 
          return res.redirect('/');//用户不存在则跳转到登录页
        }
        if (user.password != password) {
          req.flash('error', '密码错误!'); 
          return res.redirect('/');
        }
        req.session.user = user;
        req.flash('success', '登录成功!');
        res.redirect('/home');
    });
});

router.get('/register',checkIsLogin);
router.get('/register',function(req,res){
    res.render('register',{
        title:'注册',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});
router.post('/register',function(req,res){
    var email = req.body.email,
        password = req.body.password,
        password_re = req.body['password-repeat'],
        captcha = req.body.captcha;
    if(password != password_re) {
        req.flash('error','两次输入的密码不一致！');
        return res.redirect('/register');
    }
    
    //judgeNamePassword(req,res,email,password,'/register');
    var regEx = /^[a-zA-Z0-9_]{3,20}$/;
	if(!regEx.test(email)){
		req.flash('error','用户名长度为3-20，只能是字母、数字、下划线的组合');
		return res.redirect('/register');
	}

	var judge =  (/[a-z]/.test(password)&& /[A-Z]/.test(password) && /[0-9]/.test(password));
    if(!judge){
    	req.flash('error','密码长度不少于6，必须同时包含数字、小写字母、大写字母');
        return res.redirect('/register');
    }

    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
        password : password,
        email : email
    });
    //console.log(newUser);
    //检查用户名是否已经存在 
    console.log(newUser.email);
    User.get(newUser.email, function (err, user) {
        if (err) {
          req.flash('error', err);
          console.log('error'+err);
          return res.redirect('/');
        }
        if (captcha != req.session.captcha){
          req.flash('error', '验证码输入错误！');
          console.log('captcha wrong! ');
          
          return res.redirect('/register');//返回注册页
        }
        if (user) {
          req.flash('error', '用户已存在！');
          console.log('already exited! ');
          
          return res.redirect('/register');//返回注册页
        }
        
        //如果不存在则新增用户
        newUser.save(function (err, user) {
          if (err) {
            req.flash('error', err);
            console.log('error'+err);
            return res.redirect('/register');//注册失败返回注册页
          }
          //req.session.user = newUser;//用户信息存入 session
          console.log('success');
          req.flash('success', '注册成功!');
          return res.redirect('/');//注册成功后返回主页
        });
    });
});

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
router.get('/home', function(req, res) {
    var allPosts = [];
    Post.get(req.session.user.email,function(err,posts){
        
        if(err){
            posts = [];
        }
        if(req.session.user.email == '1601210650'){
            Post.getAll(function(err1,allPost){
                if(err1){
                    allPosts = [];
                }
                res.render('home', { 
                    title: '主页', 
                    user: req.session.user,
                    posts: posts,
                    allPosts: allPost,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString()
                });
            });
        }
       else{
          res.render('home', { 
            title: '主页', 
            user: req.session.user,
            posts: posts,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        }); 
       }
        
    });    
});

router.get('/detail*',checkLogin);
router.get('/detail*', function(req, res) {
    console.log(req.query.id);
    Post.find(req.query.id,function(err,posts){
        if(err){
            posts = [];
        }
        console.log(posts);
        res.render('detail', { 
            title: '详情',
            posts: posts,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
});

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
router.post('/post', function (req, res) {
    var judge = 1;
    var currentUser = req.session.user,
        post = new Post(currentUser.email, req.body.title, req.body.key, req.body.post);
        post.save(function (err) {
            if (err) {
                req.flash('error', err); 
                judge = 0;
                //return res.redirect('/home');
            }
            req.flash('success', '发布成功!');
            res.json({type: judge});
            //res.redirect('/home');//发表成功跳转到主页
        });
});

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

