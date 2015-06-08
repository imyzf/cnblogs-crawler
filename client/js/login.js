function login() {
  $.post('/api/Users/login',
    {
      username: $('#username').val(),
      password: $('#password').val()
    },
    function (data) {
      if (data.id)
        location.href = '/admin.html';
      else
        alert('登录失败');
    });
}

$(document).ready(function() {
  $('#login-btn').click(login);
  $('#login-form').keypress(function (event) {
    if (event.keyCode == 13)  login()
  });
});
$(document).ajaxError(function () {
  alert('登录失败');
});
