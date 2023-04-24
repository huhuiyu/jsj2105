import ajax from '../../js/ajax.js';
import md5 from '../../js/md5.min.js';

let txtName = document.getElementById('txtName');
let txtCode = document.getElementById('txtCode');
let btnCode = document.getElementById('btnCode');
let txtPwd = document.getElementById('txtPwd');
let btnOk = document.getElementById('btnOk');

btnCode.addEventListener('click', () => {
  let info = {
    username: txtName.value,
  };
  ajax.send('/tool/sendUserEmailCode', info, (data) => {
    showAlert(data.message);
  });
});

btnOk.addEventListener('click', () => {
  if (txtPwd.value.trim() == '') {
    showAlert('新密码必须填写');
    return;
  }

  let info = {
    username: txtName.value,
    code: txtCode.value,
    password: md5.hash(txtPwd.value),
  };

  ajax.send('/user/auth/findPwdByEmail', info, (data) => {
    showAlert(data.message);
  });
});

// 作业：手机绑定和手机找回密码

//#region alert对话框部分
let liveToast = document.getElementById('liveToast');
let liveToastMessage = document.querySelector('#liveToast .toast-body');
const toast = new bootstrap.Toast(liveToast);

function showAlert(message) {
  liveToastMessage.innerHTML = message;
  toast.show();
}
//#endregion
