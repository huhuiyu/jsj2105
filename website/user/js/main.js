import ajax from '../../js/ajax.js';

let spUserName = document.getElementById('spUserName');
let spLoginName = document.getElementById('spLoginName');
let divInfo = document.getElementById('divInfo');

// 用户信息保护三个部分
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
function showUserInfo() {
  spUserName.innerHTML = tbUser.nickname;

  spLoginName.innerHTML = tbUser.username;
  divInfo.append(JSON.stringify(tbUser));
  divInfo.append(document.createElement('br'));
  divInfo.append(JSON.stringify(tbUserInfo));
  divInfo.append(document.createElement('br'));
  divInfo.append(JSON.stringify(userOtherInfo));
}

// 安全退出
function logout() {
  ajax.send('/user/auth/logout', {}, () => {
    location.href = './login.html';
  });
}

document.getElementById('alogout').addEventListener('click', logout);

queryUserInfo();
