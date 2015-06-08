var articleUrl = location.hash.substring(1),
  urlList = [],
  currentId = 0;

function dateString(isoDate) {
  var date = new Date(isoDate);
  return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' '
  + date.getHours() + ':' + date.getMinutes();
}

function loadArticle(url){
  $.getJSON('http://localhost:3000/api/articles/findOne',
    {
      filter: {
        where: {id: url},
        fields: {title: true, author: true, date: true, content: true}
      }
    },
    function (data) {
      $('#title').text(data.title);
      $('#author').text(data.author);
      var date = new Date(data.date);
      $('#date').text(dateString(data.date));
      var content = $('#content');
      content.html(data.content);
      $(content).find('*').removeAttr('style');
    })
}

function loadArticleList() {
  $.getJSON('http://localhost:3000/api/articles',
    {
      filter: {
        fields: {title: true, author: true, date: true, id: true},
        order: 'date DESC'
      }
    },
    function (data) {
      var count = 0;
      data.forEach(function (item) {
        var articleItem = '<div class="article-item" id="' + count + '">' +
          '<h4>' + item.title + '</h4>' +
          '<p><span class="author">' + item.author + '</span><span class="date">' +
            dateString(item.date) + '</span></p>' +
        '</div>';
        $('#article-list').append(articleItem);
        if (item.id == articleUrl)
        {
          currentId = count;
          $('#'+ currentId).addClass('current-view');
        }
        urlList[count] = item.id;
        count ++;
      })
    })
}

$(document).ready(function () {
  loadArticleList();
  loadArticle(articleUrl);

  $('#article-list').on('click', '.article-item', function () {
    $('#' + currentId).removeClass('current-view');
    currentId = $(this).attr('id');
    loadArticle(urlList[currentId]);
    $('#'+ currentId).addClass('current-view');
    location.href = '#' + urlList[currentId];
  })
});
