var later = require("later");
var https = require("https");

var appid = "wx00b2e3c441296c24";
var appsecret = "31fe10e23ebf87e46003f12cf2af46e0";
var access_token;

var Token = require('./common/tokens.js');

later.date.localTime();
console.log("Now:"+new Date());

var sched = later.parse.recur().every(1).hour();
//var sched = later.parse.recur().every(5).second();
next = later.schedule(sched).next(10);
console.log(next);

var timer = later.setInterval(test,sched);
setTimeout(test,2000);

function test(){
	console.log(new Date());
	var options = {
		hostname : "api.weixin.qq.com",
		path : "/cgi-bin/token?grant_type=client_credential&appid=" + appid + '&secret=' + appsecret
	};
	var req = https.get(options,function(res){
		var bodyChunks = '';
		res.on('data',function(chunk){
			bodyChunks += chunk;
		});
		res.on('end',function(){
			var body = JSON.parse(bodyChunks);
			if(body.access_token){
				access_token = body.access_token;
				saveAccessToken(access_token);
				console.log(access_token);
			}else{
				console.dir(body);
			}
		});
	});

	req.on('error',function(e){
		console.log('Error: ' + e.message);
	});
}

saveAccessToken('YcuJQ78M9Ky9lueQhWUGA8_anoiUnZ50CxmMtTEV4bh-LtBoijhor9lXtxe51pc6UmrJFPuU6yL3hGNyi6oH_HXRaOrDakhvDNcX701vjqcXBTcAAATXP');
function saveAccessToken(access_token){
	Token.updateData(access_token,function (err) {
        if (err) {
          console.log('Error: ' + err.message);
        }
        //console.log(token);
    });
}
