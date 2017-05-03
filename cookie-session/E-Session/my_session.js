var express = require('express');
var parseurl = require('parseurl');
var session = require('express-session');
var uuid = require('uuid');
var cookieParser = require('cookie-parser');
var clone = require('clone');

var app = express();

function my_session(){
	var data = {};
	return function(req,res,next){
		var id = req.signdCookies.session_id||uuid.v4();
		res.cookie('session_id',id,{
			maxAge:60000,
			path:'/',
			httpOnly:true,
			signed:true
		});
		req.session= clone(data[id]||{});
		res.on('finish',function(){
			console.log('save session');
			data[id] = clone(req.session);
		});
		next();
	}
}

app.use(cookieParser('hahahah'));
app.use(my_session());
