var http = require('http');
var cheerio = require('cheerio');

module.exports = function (Article) {

  function crawlPage(currentPage, maxPage, cb) {
    if (currentPage > maxPage) {
      cb(null, 'finish');
      return;
    }
    for (var i = 0; i < 3; i++) console.log();
    console.log('------------ page ' + currentPage + ' -------------------');
    for (var i = 0; i < 3; i++) console.log();
    var options = {
      hostname: 'www.cnblogs.com',
      path: '/mvc/AggSite/PostList.aspx',
      method: 'POST',
      headers: {
        'Connection': 'keep-alive',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.65 Safari/537.36',
        'Content-Type': 'application/json; charset=UTF-8',
        'Referer': 'http://www.cnblogs.com/',
        'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4,en-US;q=0.2'
      }
    };
    var req = http.request(options, function (res) {
      var html = '';
      res.on('data', function (chunk) {
        html += chunk;
      });
      res.on('end', function () {
        var $ = cheerio.load(html);
        $('.post_item_body').each(function () {
          var postItem = $(this);
          var titleLink = postItem.find('.titlelnk');
          var title = titleLink.text();
          var articleUrl = titleLink.attr('href');
          var summary = postItem.children('.post_item_summary').text();
          var itemFoot = postItem.children('.post_item_foot');
          var author = itemFoot.children('a').text();
          var dateReg = new RegExp(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/);
          var date = new Date(dateReg.exec(itemFoot.contents()[2]));
          console.log('title  ', title);
          console.log('url  ', articleUrl);
          console.log('summary  ', summary);
          console.log('author  ', author);
          console.log('date  ', date);
          console.log('----------------------------------------------------------');
        });
        crawlPage(currentPage + 1, maxPage, cb);
      })
    });
    req.write(JSON.stringify({
      CategoryId: 808,
      CategoryType: "SiteHome",
      ItemListActionName: "PostList",
      PageIndex: currentPage,
      ParentCategoryId: 0
    }));
    req.end();
  }

  Article.crawl = function (cb) {
    crawlPage(1, 3, cb)
  };

  Article.remoteMethod(
    'crawl',
    {
      http: {verb: 'get'},
      returns: {arg: 'status', type: 'string'}
    }
  )
};
