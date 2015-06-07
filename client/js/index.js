$(document).ready(function () {
  $.getJSON('http://localhost:3000/api/articles',
    {
      filter: {
        fields: {id: true, title: true, summary: true, author: true, date: true}
      }
    },
    function (data) {
      data.forEach(function(item) {
        var date = new Date(item.date);
        date = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' '
          + date.getHours() + ':' + date.getMinutes();
        var article =
          '<a href="reader.html#' + item.id + '" target="_self">' +
            '<article>' +
            '<h1>' + item.title + '</h1>' +
            '<p class="summary">' + item.summary + '</p>' +
            '<p class="footer">' +
              '<span class="author">' + item.author + '</span>发表于<span class="date">' + date + '</span>' +
            '</p>' +
            '</article>' +
          '</a>';
        $('#article-list').append(article);
      })
    })
});
