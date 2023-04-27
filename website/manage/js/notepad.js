import ajax from '../../js/ajax.js';
import tools from '../../js/tools.js';

//#region 数据查询部分
let tbData = document.getElementById('tbData');
let txtQTitle = document.getElementById('txtQTitle');
let txtQInfo = document.getElementById('txtQInfo');
let btnQuery = document.getElementById('btnQuery');
let btnReset = document.getElementById('btnReset');

btnQuery.addEventListener('click', query);

let queryInfo = {
  title: '',
  info: '',
};

let page = {
  pageNumber: 1,
  pageSize: 3,
};

let list = [];

function query() {
  queryInfo.title = txtQTitle.value;
  queryInfo.info = txtQInfo.value;

  let info = tools.concatJson(queryInfo, page);

  ajax.send('/user/note/queryAll', info, (data) => {
    if (!data.success) {
      showAlert(data.message);
      return;
    }
    page = data.page;
    list = data.list;
    showData();
    showPage();
  });
}

function showData() {
  tbData.innerHTML = '';

  for (let i = 0; i < list.length; i++) {
    const info = list[i];
    let tr = document.createElement('tr');
    tbData.append(tr);
    let td;
    // 标题
    td = document.createElement('td');
    td.append(info.title);
    tr.append(td);

    // 内容
    td = document.createElement('td');
    td.append(info.info);
    tr.append(td);

    // 信息最后修改时间
    td = document.createElement('td');
    td.append(tools.formatDate(info.lastupdate));
    tr.append(td);
  }
}

let pages = document.querySelectorAll('#navPage a');
console.log('分页相关元素：', pages);

function showPage() {
  pages[1].innerHTML = `
    当前页/总页数/记录数：
    ${page.pageNumber}/
    ${page.pageCount}/
    ${page.total}
  `;
}

pages[0].addEventListener('click', () => {
  page.pageNumber--;
  if (page.pageNumber < 1) {
    page.pageNumber = 1;
    return;
  }
  query();
});

pages[2].addEventListener('click', () => {
  page.pageNumber++;
  if (page.pageNumber > page.pageCount) {
    page.pageNumber = page.pageCount;
    return;
  }
  query();
});

//#endregion

//#region 添加的部分

let addDialog = document.getElementById('addDialog');
let txtATitie = document.getElementById('txtATitie');
let txtAInfo = document.getElementById('txtAInfo');
let btnAdd = document.getElementById('btnAdd');

btnAdd.addEventListener('click', () => {
  let info = {
    title: txtATitie.value,
    info: txtAInfo.value,
  };

  ajax.send('/user/note/add', info, (data) => {
    if (data.success) {
      txtATitie.value = '';
      txtAInfo.value = '';
    }
    showAlert(data.message);
  });
});

addDialog.addEventListener('hide.bs.modal', query);

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

//#region 修改的部分
let modifyDialog = document.getElementById('modifyDialog');
let txtMTitie = document.getElementById('txtMTitie');
let txtMInfo = document.getElementById('txtMInfo');
let btnModify = document.getElementById('btnModify');

let modifyInfo = {};

function showModiy(info) {
  modifyInfo = info;
}

modifyDialog.addEventListener('hide.bs.modal', query);

//#endregion

//#region 删除的部分
let delInfo = {};

function showDel(info) {
  delInfo = info;
}

//#endregion

query();
