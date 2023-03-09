import ajax from '../../js/ajax.js';
import md5 from '../../js/md5.min.js';

let txtUsername = document.getElementById('txtUsername');
let txtPassword = document.getElementById('txtPassword');
let btnLogin = document.getElementById('btnLogin');
let spInfo = document.getElementById('spInfo');

btnLogin.addEventListener('click', () => {
  ajax.send(
    '/user/auth/login',
    {
      username: txtUsername.value,
      password: md5.hash(txtPassword.value),
    },
    (data) => {
      if (data.success) {
        location.href = './main.html';
        return;
      }
      spInfo.innerHTML = data.message;
    }
  );
});
