import ajax from '../../js/ajax.js';
import md5 from '../../js/md5.min.js';

let txtUsername = document.getElementById('txtUsername');
let txtPassword = document.getElementById('txtPassword');
let txtNickname = document.getElementById('txtNickname');
let btnReg = document.getElementById('btnReg');
let spInfo = document.getElementById('spInfo');

btnReg.addEventListener('click', () => {
  // 页面的请求参数
  let user = {
    nickname: txtNickname.value.trim(),
    password: txtPassword.value.trim(),
    username: txtUsername.value.trim(),
  };
  console.log('页面提交的数据', user);
  if ('' == user.password) {
    alert('密码必须填写！');
    return;
  }
  // 密码需要加密
  user.password = md5.hash(user.password);
  // 注册
  ajax.send('/user/auth/reg', user, (data) => {
    spInfo.innerHTML = JSON.stringify(data);
  });
});
