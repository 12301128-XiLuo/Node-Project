var Token = require('./tokens.js');

function getAccessToken(func){
	var access_token = null;
	Token.get('wechat', function (err, token) {
        if (!token) {
          console.log('null');
        }
        access_token = token.access_token
        console.log("test: "+access_token);
        func(access_token);
    });
}

exports.getAccessToken = getAccessToken;