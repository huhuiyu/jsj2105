import { ajax } from '../../js/ajax.js';
import { tools } from '../../js/tools.js';

//#region 查询的部分

let page = {
  pageNumber: 1,
  pageSize: 5,
  total: 0,
  pageCount: 0,
};

let queryInfo = {
  contentType: '',
  fileinfo: '',
  filename: '',
};

let list = [];

function query() {}
function showData() {}

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

query();
