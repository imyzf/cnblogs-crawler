$(document).ready(function () {
  $.getJSON('http://localhost:3000/api/articles',
    {
      filter: {
        fields: {id: true, title: true, summary: true, author: true, date: true, cover: true},
        order: 'date DESC'
      }
    },
    function (data) {
      var count = 0;
      var colLeft = '';
      var colRight = '';
      data.forEach(function(item) {
        count ++;
        var date = new Date(item.date);
        date = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' '
          + date.getHours() + ':' + date.getMinutes();
        var article =
          '<div class="article-div">' +
          '<a href="reader.html#' + item.id + '" target="_blank">' +
            '<article>' +
            '<h1>' + item.title + '</h1>' +
            (item.cover ? '<img src="' + item.cover + '">' : '' ) +
            '<p class="summary">' + item.summary + '</p>' +
            '<p class="footer">' +
              '<span class="author">' + item.author + '</span>发表于<span class="date">' + date + '</span>' +
            '</p>' +
            '</article>' +
          '</a>' +
          '</div>';
        if (count % 2)
          colLeft += article;
        else
          colRight += article;
      });
      $('#col-left').append(colLeft);
      $('#col-right').append(colRight);
    })
});
