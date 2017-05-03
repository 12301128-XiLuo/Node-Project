/**
 * Created by admin on 2017/3/4.
 */

var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');

http.get('http://channel.chinanews.com/cns/cl/yl-mxnd.shtml',function(res){
    var html = '';
    var news = [];
    res.setEncoding('utf-8');

    //抓取网页内容
    res.on('data',function(chunk){
       html += chunk;
    });

    //网页内容抓取完毕
    res.on('end',function () {
        //console.log(html);
        var $ = cheerio.load(html);

        $('.con2 table').each(function (index,item) {
            console.log("-----------------------------------");
            if(index%2==0){
                var title = $('.color065590 a',this).text();
                var time = $('.color065590',this).siblings().text();
                var content = $('tr td font',this).text();
                var link = $('.color065590 a',this).attr('href');
                var judge = false;
                //判断有无内容,有内容就把\r\t\n去除
                if(title!=undefined) {
                    title = title.replace(/[\r\n]/g,"");
                    judge = true;
                }
                if(time!=undefined) {
                    time = time.replace(/[\r\n]/g,"");
                    judge = true;
                }
                if(content!=undefined) {
                    content = content.replace(/[\r\n]/g,"");
                    judge = true;
                }
                if(link!=undefined) {
                    link = link.replace(/[\t\r\n]/g,"");
                    judge = true;
                }
                if(judge == true){
                    var news_item = {
                        title: title,
                        time: time,
                        content: content,
                        link: link
                    };
                    news.push(news_item);
                    console.log(news_item);
                }

            }
            //console.log('----------------------------------');
        });
        //console.log(news);
    });

}).on('error',function (err) {
    console.log(err);
});