import ajax from '../../js/ajax.js';
import tools from '../../js/tools.js';

//#region 数据查询部分
let tbData = document.getElementById('tbData');


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
