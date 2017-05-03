var express = require('express');
var parseurl = require('parseurl');
var session = require('express-session');
var uuid = require('uuid');
var cookieParser = require('cookie-parser');
var clone = require('clone');

var app = express();
//挂载session
// app.use(session({
// 	secret: 'keyboard cat',
// 	resave: false,
// 	saveUnintialized: true
// }));

/**
 * [my_session 自定义创建session]
 * @return {[type]} [description]
 */
function my_session(){
	var data = {};
	return function(req,res,next){
		//设置id
		var id = req.signedCookies.session_id||uuid.v4();
		//存储cookie
		res.cookie('session_id',id,{
			maxAge:60000,
			path:'/',
			httpOnly:true,
			signed:true
		});
		//赋值
		req.session= clone(data[id]||{});
		res.on('finish',function(){
			console.log('save session');
			data[id] = clone(req.session);
		});
		//进行下一步
		next();
	}
}

app.use(cookieParser('hahahah'));
app.use(my_session());

//测试的中间件
app.use(function(res,req,next){
	console.log("我是中间件");
	next();
})
//统计访问次数
app.use(function(req,res,next){
	var views = req.session.views;
	if(!views){
		views = req.session.views = {};
	}
	var pathname = parseurl(req).pathname;
	//统计访问次数
	views[pathname] = (views[pathname]||0)+1;
	next();
})
/**
 * [/foo]                                
 **/
app.get('/foo',function(req,res,next){
	res.send('you viewed this page'+req.session.views['/foo']+'times');
});
/**
 * [/bar]                                
 **/
app.get('/bar',function(req,res,next){
	res.send('you viewed this page'+req.session.views['/bar']+'times');
});


app.listen(3000);
console.log('Server runnning at port: 3000');