import { ajax } from '../../js/ajax.js';
import { tools } from '../../js/tools.js';

//#region 公用方法的部分

// 文件是否支持预览
function isPreview(info) {
  return (
    info.contentType.startsWith('image/') ||
    info.contentType.startsWith('audio/') ||
    info.contentType.startsWith('video/')
  );
}

function isImage(info) {
  return info.contentType.startsWith('image/');
}

function isAudio(info) {
  return info.contentType.startsWith('audio/');
}

function isVideo(info) {
  return info.contentType.startsWith('video/');
}

//#endregion

//#region 预览文件的部分
// document.getElementById
// document.querySelector
// document.querySelectorAll('div')

let previewDialog = document.getElementById('previewDialog');
let previewDialogObj = new bootstrap.Modal(previewDialog);
let previewDialogBody = document.querySelector(
  '#previewDialog .modal-body > div'
);

function preview(info) {
  previewDialogBody.innerHTML = '';
  let ele;
  // 三种预览模式
  if (isImage(info)) {
    ele = document.createElement('img');
    ele.setAttribute('src', ajax.getFileUrl(info.fid));
  } else if (isAudio(info)) {
    ele = document.createElement('audio');
    ele.setAttribute('src', ajax.getFileUrl(info.fid));
    ele.setAttribute('controls', '');
  } else if (isVideo(info)) {
    ele = document.createElement('video');
    ele.setAttribute('src', ajax.getFileUrl(info.fid));
    ele.setAttribute('controls', '');
  }
  previewDialogBody.append(ele);

  previewDialogObj.toggle();
}

//#endregion

//#region 查询的部分

let txtQContentType = document.getElementById('txtQContentType');
let txtQFileinfo = document.getElementById('txtQFileinfo');
let txtQFilename = document.getElementById('txtQFilename');
let btnQuery = document.getElementById('btnQuery');
let tbData = document.getElementById('tbData');

let page = {
  pageNumber: 1,
  pageSize: 10,
  total: 0,
  pageCount: 0,
};

let queryInfo = {
  contentType: '',
  fileinfo: '',
  filename: '',
};

let list = [];

function query() {
  // 处理查询参数
  queryInfo.contentType = txtQContentType.value;
  queryInfo.fileinfo = txtQFileinfo.value;
  queryInfo.filename = txtQFilename.value;
  // 查询
  ajax.send(
    '/user/file/queryAll',
    tools.concatJson(queryInfo, page),
    (data) => {
      if (!data.success) {
        showAlert(data.message);
        return;
      }
      list = data.list;
      page = data.page;
      showData();
    }
  );
}
function showData() {
  tbData.innerHTML = '';
  for (let i = 0; i < list.length; i++) {
    const info = list[i];
    let tr = document.createElement('tr');
    let td;
    // 文件名
    td = document.createElement('td');
    td.append(info.filename);
    tr.append(td);
    // 文件描述
    td = document.createElement('td');
    td.append(info.fileinfo);
    tr.append(td);
    // 文件大小
    td = document.createElement('td');
    td.append(info.fileSize);
    tr.append(td);
    // 文件类型
    td = document.createElement('td');
    td.append(info.contentType);
    tr.append(td);
    // 上传时间
    td = document.createElement('td');
    td.append(tools.formatDate(info.lastupdate));
    tr.append(td);
    // 操作的部分
    td = document.createElement('td');
    // 下载功能
    let btn1 = document.createElement('span');
    btn1.classList.add('btn', 'btn-sm', 'btn-primary', 'me-1');
    btn1.append('下载');
    btn1.addEventListener('click', () => {
      download(info);
    });
    td.append(btn1);
    // 预览的功能
    if (isPreview(info)) {
      let btn2 = document.createElement('span');
      btn2.classList.add('btn', 'btn-sm', 'btn-info', 'me-1');
      btn2.append('预览');
      btn2.addEventListener('click', () => {
        preview(info);
      });
      td.append(btn2);
    }
    // 复制地址的功能
    let btn3 = document.createElement('span');
    btn3.classList.add('btn', 'btn-sm', 'btn-info', 'me-1');
    btn3.append('复制地址');
    btn3.addEventListener('click', () => {
      let url = ajax.getFileUrl(info.fid);
      tools.copyText(url);
      showAlert('地址复制完毕');
    });
    td.append(btn3);

    tr.append(td);

    tbData.append(tr);
  }
}

function download(info) {
  let url = ajax.getFileUrl(info.fid);
  console.log(url, ajax.getFileUrlFid(url), ajax.isFileUrl(url));
  window.open(url);
}

//#endregion

//#region 添加的部分

let btnShowAdd = document.getElementById('btnShowAdd');
let addDialog = document.getElementById('addDialog');
let btnBrowse = document.getElementById('btnBrowse');
let spFile = document.getElementById('spFile');
let txtAFileinfo = document.getElementById('txtAFileinfo');
let btnAdd = document.getElementById('btnAdd');

let file;
// bootstrap的对话框对象
let addDialogObj = new bootstrap.Modal(addDialog);

btnShowAdd.addEventListener('click', () => {
  addDialogObj.toggle();
});

addDialog.addEventListener('hide.bs.modal', () => {
  query();
});

addDialog.addEventListener('shown.bs.modal', () => {
  txtAFileinfo.focus();
});

btnBrowse.addEventListener('click', () => {
  file = null;
  spFile.innerHTML = '';

  tools.openFile((fileinfo) => {
    if (fileinfo) {
      file = fileinfo;
      spFile.innerHTML = `${file.name}`;
    }
  });
});

btnAdd.addEventListener('click', () => {
  if (!file) {
    return;
  }
  ajax.sendFile(file, txtAFileinfo.value, (data) => {
    if (data.success) {
      file = null;
      spFile.innerHTML = '';
      showAlert(JSON.stringify(data.data, null, 2));
    } else {
      showAlert(data.message);
    }
  });
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

query();
