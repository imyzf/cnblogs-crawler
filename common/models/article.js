var http = require('http');
var cheerio = require('cheerio');

module.exports = function (Article) {

  function crawlPage(currentPage, maxPage, cb) {
    if (currentPage > maxPage) {
      cb(null, 'finish');
      return;
    }
    var options = {
      hostname: 'www.cnblogs.com',
      path: '/mvc/AggSite/PostList.aspx',
      method: 'POST',
      headers: {
        'Connection': 'keep-alive',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
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
        var postItemBody = $('.post_item_body');
        postItemBody.each(function (index) {
          var postItem = $(this);
          var titleLink = postItem.find('.titlelnk');
          var title = titleLink.text();
          var articleUrl = titleLink.attr('href');
          var summary = postItem.children('.post_item_summary').text();
          var itemFoot = postItem.children('.post_item_foot');
          var author = itemFoot.children('a').text();
          var dateReg = new RegExp(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/);
          var date = new Date(dateReg.exec(itemFoot.contents()[2].data)[0]);
          var req = http.get(articleUrl, function (res) {
            var articleHtml = '';
            res.on('data', function (chunk) {
              articleHtml += chunk;
            });
            res.on('end', function () {
              var $ = cheerio.load(articleHtml);
              var content = $('#cnblogs_post_body').html();
              Article.upsert(
                {
                  id: articleUrl,
                  title: title,
                  date: date,
                  author: author,
                  summary: summary,
                  content: content
                }
              );
              if (index == postItemBody.length - 1)
                crawlPage(currentPage + 1, maxPage, cb);
            });
          });
        });
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

  Article.crawl = function (category, start, end, cb) {
    if (start > end)
      cb({name: 'args error', status: '400', message: 'start cannot be larger than end'});
    else
      crawlPage(start, end, cb);
  };

  Article.remoteMethod(
    'crawl',
    {
      http: {verb: 'get'},
      accepts: [
        {arg: 'category', type: 'string'},
        {arg: 'start', type: 'number', required: true},
        {arg: 'end', type: 'number', required: true}
      ],
      returns: {arg: 'status', type: 'string'}
    }
  )
};
