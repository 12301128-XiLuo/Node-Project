var http = require('http');
//引入URL
var parseUrl =require('url').parse;
var NEWS = {
	1 : '这里是第一篇新闻的内容',
	2 : '这里是第二篇新闻的内容',
	3 : '这里是第三篇新闻的内容'
};

function getNews(id){
	return NEWS[id]||'文章不存在';
}

var server = http.createServer(function(req,res){
	//内部方法
	function send(html){
		res.writeHead(200,{
			'content-type':'text/html;charset=utf-8'
		});
		res.end(html);
	}
	var info = parseUrl(req.url,true);
	req.pathname = info.pathname;
	req.query = info.query;
	//根据请求的页面 返回不同的信息
	if(req.url === '/'){
		send('<ul>'+
				'<li><a href="/news?type=1&id=1">新闻一</a></li>'+
				'<li><a href="/news?type=1&id=2">新闻二</a></li>'+
				'<li><a href="/news?type=1&id=3">新闻三</a></li>'+
			'</ul>');
	}
	//通过URL的方式判断，用户点击的是哪个链接
	else if (req.pathname === '/news'&&req.query.type === '1') {
		send(getNews(req.query.id));
	}
	// else if(req.url === '/news?id=1'){
	// 	send(getNews(1));
	// }else if(req.url === '/news?id=2'){
	// 	send(getNews(2));
	// }else if(req.url === '/news?id=3'){
	// 	send(getNews(3));
	// }
	else{
		send('<h1>文章不存在！</h1>');
	}
});

server.listen(3001);