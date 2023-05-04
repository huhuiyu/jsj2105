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

    // 操作
    td = document.createElement('td');
    // 修改按钮
    let btn01 = document.createElement('span');
    btn01.classList.add('btn', 'btn-primary', 'btn-sm', 'me-1');
    // btn01.setAttribute('data-bs-toggle', 'modal');
    // btn01.setAttribute('data-bs-target', '#modifyDialog');
    btn01.append('修改');
    td.append(btn01);
    btn01.addEventListener('click', () => {
      showModiy(info);
    });

    // 删除按钮
    let btn02 = document.createElement('span');
    btn02.classList.add('btn', 'btn-danger', 'btn-sm');
    btn02.append('删除');
    td.append(btn02);
    btn02.addEventListener('click', () => {
      showDel(info);
    });

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
// bootstarp的对象
let mdialog = new bootstrap.Modal(modifyDialog);

function showModiy(info) {
  modifyInfo = info;
  txtMTitie.value = info.title;
  txtMInfo.value = info.info;
  // bootstarp对象的方法
  mdialog.toggle();
}

btnModify.addEventListener('click', () => {
  modifyInfo.title = txtMTitie.value;
  modifyInfo.info = txtMInfo.value;

  ajax.send('/user/note/update', modifyInfo, (data) => {
    showAlert(data.message);
  });
});

modifyDialog.addEventListener('hide.bs.modal', query);

//#endregion

//#region 删除的部分
let delDialog = document.getElementById('delDialog');
let delDialogBody = document.querySelector('#delDialog .modal-body');
let btnDel = document.getElementById('btnDel');

let ddialog = new bootstrap.Modal(delDialog);

let delInfo = {};

function showDel(info) {
  delInfo = info;
  delDialogBody.innerHTML = `是否删除：${delInfo.title}？`;
  ddialog.toggle();
}

btnDel.addEventListener('click', () => {
  ddialog.toggle();
  ajax.send(
    '/user/note/delete',
    {
      unid: delInfo.unid,
    },
    (data) => {
      showAlert(data.message);
      page.pageNumber = 1;
      query();
    }
  );
});

//#endregion

query();

// 删除记录的查询部分自己完成
ajax.send('/user/note/queryAllDeleted', {}, (data) => {
  console.log('删除的记录：', data);
});
