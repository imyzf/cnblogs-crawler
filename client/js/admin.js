$(document).ready(function () {
  $('#btn-crawl').click(function () {
    var startPage = $('#start-page').val(),
      endPage = $('#end-page').val();
    if (!startPage || !endPage || startPage > endPage || startPage <= 0 || endPage <= 0) {
      alert('请填写正确的页码！');
      return;
    }
    $('#waiting').show();
    $.get('/api/articles/crawl',
      {
        start: startPage,
        end: endPage
      },
      function (data) {
        $('#waiting').hide();
        if (data.status == 'finish')
          alert('抓取成功');
        else
          alert('抓取出错');
      })
  });
  $('#btn-delete').click(function () {
    $('#waiting').show();
    $.get('/api/articles/delete', function (data) {
      $('#waiting').hide();
      if (data.status == 'finish')
        alert('清空数据库成功');
      else
        alert('清空数据库出错');
    })
  })
});

$(document).ajaxError(function () {
  alert('请求出错');
});
