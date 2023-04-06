import ajax from '../../js/ajax.js';

// 用户信息包含三个部分
let tbUser = {};
let tbUserInfo = {};
let userOtherInfo = {};

// 查询登录用户的信息
function queryUserInfo() {
  ajax.send('/user/auth/getUserInfo', {}, (data) => {
    console.log('用户信息：', data);

    if (data.success) {
      tbUser = data.tbUser;
      tbUserInfo = data.tbUserInfo;
      userOtherInfo = data.userOtherInfo;
      showUserInfo();
    } else {
      alert(data.message);
      location.href = './login.html';
    }
  });
}

// 显示用户信息
let btnUsername = document.querySelector('#divMenu > .dropdown-toggle');
let spUser = document.getElementById('spUser');

function showUserInfo() {
  btnUsername.innerHTML = tbUser.nickname;
  spUser.innerHTML = `${tbUser.username}(${tbUser.nickname}-${tbUser.role})`;
}

// 安全退出
let spLogout = document.getElementById('spLogout');
function logout() {
  ajax.send('/user/auth/logout', {}, () => {
    location.href = './login.html';
  });
}

spLogout.addEventListener('click', logout);

queryUserInfo();
