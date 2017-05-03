var https = require('https');
var util = require('./common/util');

var access_token=util.getAccessToken(console.log);

// console.log(access_token);
var menu = {
    "button": [
        
        {
            "type": "view",
            "name": "我要签到",
            "url": "http://pku.xixi.kkxixi.com:3000/"
        },
        {
            "name": "关于我",
            "sub_button": [
                {
                    "type": "view",
                    "name": "个人简历",
                    "url": "http://pku.xixi.kkxixi.com:9999/"
                },
                {
                    "type": "view",
                    "name": "我的简书",
                    "url": "http://www.jianshu.com/u/55d3d4c82413"
                },
                {
                    "type": "view",
                    "name": "GitHub",
                    "url": "https://github.com/12301128-XiLuo"
                }
            ]
        }
    ]
};

// var post_str = new Buffer(JSON.stringify(menu));
// //var post_str = JSON.stringify(menu);
// console.log(post_str.toString());
// console.log(post_str.length);

// var post_options = {
//     host: 'api.weixin.qq.com',
//     port: '443',
//     path: '/cgi-bin/menu/create?access_token=' + access_token,
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         'Content-Length': post_str.length
//     }
// };

// var post_req = https.request(post_options, function (response) {
//     var responseText = [];
//     var size = 0;
//     response.setEncoding('utf8');
//     response.on('data', function (data) {
//         responseText.push(data);
//         size += data.length;
//     });
//     response.on('end', function () {
//         console.log(responseText);
//     });
// });

// // post the data
// post_req.write(post_str);
// post_req.end();