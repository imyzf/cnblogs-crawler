var http = require('http');
var cheerio = require('cheerio');

module.exports = function (Article) {

  function crawlPage(url, cb) {
    http.get(url, function (res) {
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

        });
        cb(null, 'finish');
      })
    });
  }

  Article.crawl = function (cb) {
    crawlPage('http://www.cnblogs.com/', cb)
  };

  Article.remoteMethod(
    'crawl',
    {
      http: {verb: 'get'},
      returns: {arg: 'status', type: 'string'}
    }
  )
};
