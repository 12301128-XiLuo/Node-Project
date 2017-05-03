var express = require('express');
var cookieParser = require('cookie-parser');

var app = express();
//使用signed 一定要写secret
app.use(cookieParser('hahahahaha'));
/**
 * [通过/read读取cookie值]                                
 **/
app.get('/read',function(req,res,next){
	res.json(req.cookies);
});
/**
 * [通过/abc读取cookie值]                                
 **/
app.get('/abc',function(req,res,next){
	res.json(req.cookies);
});
/**
 * [通过/wirte写cookie]                                
 **/
app.get('/write',function(req,res,next){
	res.cookie('my_cookie','hello',{/*domain:'www.abc.com',*/path:'/abc',expires:new Date(Date.now()+2*60*1000)});
	res.cookie('a','234');
	res.cookie('b','456',{httpOnly:true,signed:true});
	res.json(req.cookies);
	//res.json(req.signedCookies);
});

app.listen(3000);
console.log('Server runnning at port: 3000');