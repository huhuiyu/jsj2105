import ajax from '../../js/ajax.js';
import tools from '../../js/tools.js';

// 用户信息包含三个部分
let tbUser = {};
let tbUserInfo = {};
let userOtherInfo = {};
let imgLogo = document.getElementById('imgLogo');
let divUserInfo = document.getElementById('divUserInfo');

// 点击用户头像更换
let file;

imgLogo.addEventListener('click', () => {
  tools.openFile((file) => {
    if (!file) {
      return;
    }
    // 上传文件
    ajax.sendFile(file, '2105班头像上传', (data) => {
      if (!data.success) {
        showAlert(data.message);
        return;
      }
      // 判定原来的地址是否为上传的文件地址
      if (ajax.isFileUrl(tbUserInfo.img)) {
        // 如果是需要删除
        let delfid = ajax.getFileUrlFid(tbUserInfo.img);
        ajax.send('/user/file/delete', { fid: delfid }, () => {});
      }

      // 获取上传文件的地址
      let imgurl = ajax.getFileUrl(data.data.fid);
      // 更新用户附加信息
      let userinfo = JSON.parse(JSON.stringify(tbUserInfo));
      userinfo.img = imgurl;
      userinfo.nickname = tbUser.nickname;
      ajax.send('/user/auth/updateUserInfo', userinfo, (sdata) => {
        if (!sdata.success) {
          showAlert(sdata.message);
          return;
        }
        queryUserInfo();
      });
    });
  });
});

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
  // 用户头像存在就显示
  if (tbUserInfo.img.trim() != '') {
    imgLogo.setAttribute('src', tbUserInfo.img);
  }
  // 用户附加信息
  let sex = '保密';
  if (tbUserInfo.sex == 'm') {
    sex = '男';
  } else if (tbUserInfo.sex == 'f') {
    sex = '女';
  }
  let regDate = tools.formatDate(tbUser.lastupdate, 'yyyy-MM-dd');
  divUserInfo.innerHTML = `
    性别：${sex}<br>
    注册时间：${regDate}/${userOtherInfo.regDays}天<br>
    qq:${tbUserInfo.qq}<br>
    微信：${tbUserInfo.wechat}<br>
    用户简介：${tbUserInfo.info} <br>
    邮箱：${tbUserInfo.email}<br>
    手机号：${tbUserInfo.phone}<br>
    accessKey:${tbUser.accessKey}<br>
  `;
}

// 安全退出
let spLogout = document.getElementById('spLogout');
function logout() {
  ajax.send('/user/auth/logout', {}, () => {
    location.href = './login.html';
  });
}

spLogout.addEventListener('click', logout);

//#region 修改用户信息部分
// 修改信息对话框显示之前需要将表单元素进行赋值的操作
let userDialog = document.getElementById('userDialog');
let txtImg = document.getElementById('txtImg');
let txtInfo = document.getElementById('txtInfo');
let txtNickname = document.getElementById('txtNickname');
let txtQq = document.getElementById('txtQq');
let txtWechat = document.getElementById('txtWechat');
let sexm = document.getElementById('sexm');
let sexn = document.getElementById('sexn');
let sexf = document.getElementById('sexf');
let btnSave = document.getElementById('btnSave');

userDialog.addEventListener('show.bs.modal', () => {
  txtNickname.value = tbUser.nickname;
  txtImg.value = tbUserInfo.img;
  txtInfo.value = tbUserInfo.info;
  txtQq.value = tbUserInfo.qq;
  txtWechat.value = tbUserInfo.wechat;
  if (tbUserInfo.sex == 'm') {
    sexm.checked = true;
  } else if (tbUserInfo.sex == 'f') {
    sexf.checked = true;
  } else if (tbUserInfo.sex == 'n') {
    sexn.checked = true;
  }
});

btnSave.addEventListener('click', () => {
  // 性别的判断
  let sex = 'n';
  if (sexf.checked) {
    sex = 'f';
  } else if (sexm.checked) {
    sex = 'm';
  }
  // 修改的用户信息
  let user = {
    sex: sex,
    img: txtImg.value,
    info: txtInfo.value,
    nickname: txtNickname.value,
    qq: txtQq.value,
    wechat: txtWechat.value,
  };
  // 提交修改
  ajax.send('/user/auth/updateUserInfo', user, (data) => {
    showAlert(data.message);
  });
});

// 关闭时要同步更新
userDialog.addEventListener('hide.bs.modal', () => {
  queryUserInfo();
});

//#endregion

//#region alert对话框部分
let liveToast = document.getElementById('liveToast');
let liveToastMessage = document.querySelector('#liveToast .toast-body');
const toast = new bootstrap.Toast(liveToast);

function showAlert(message) {
  liveToastMessage.innerHTML = message;
  toast.show();
}
//#endregion

//#region 绑定邮箱
let txtEmail = document.getElementById('txtEmail');
let txtCode = document.getElementById('txtCode');
let btnCode = document.getElementById('btnCode');
let btnSaveEmail = document.getElementById('btnSaveEmail');

btnCode.addEventListener('click', () => {
  ajax.send(
    '/tool/sendEmailCode',
    {
      email: txtEmail.value,
    },
    (data) => {
      showAlert(data.message);
    }
  );
});

btnSaveEmail.addEventListener('click', () => {
  ajax.send(
    '/user/auth/updateUserEmail',
    {
      email: txtEmail.value,
      code: txtCode.value,
    },
    (data) => {
      showAlert(data.message);
      queryUserInfo();
    }
  );
});

//#endregion

//#region 菜单的部分
let divMenus = document.getElementById('divMenus');
// 菜单项
let menus = [
  { icon: '&#xe655;', title: '用户记事本', href: '../manage/notepad.html' },
  { icon: '&#xe658;', title: '文件管理', href: '../manage/file.html' },
  { icon: '&#xe631;', title: '黑暗骑士', href: 'https://huhuiyu.top' },
];

function showMenus() {
  divMenus.innerHTML = '';
  for (let i = 0; i < menus.length; i++) {
    const info = menus[i];
    let div1 = document.createElement('div');
    divMenus.append(div1);

    let div2 = document.createElement('div');
    let elei = document.createElement('i');
    elei.classList.add('iconfont');
    elei.innerHTML = info.icon;
    div2.append(elei);
    div1.append(div2);

    let div3 = document.createElement('div');
    div3.append(info.title);
    div1.append(div3);

    div1.addEventListener('click', () => {
      location.href = info.href;
    });
  }
}

showMenus();

//#endregion

queryUserInfo();
