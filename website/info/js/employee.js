//#region 导入其它js的部分

import ajax from '../../js/ajax.js';
import tools from '../../js/tools.js';

//#endregion

//#region  查询的部分
let page = {
  pageNumber: 1,
  pageSize: 5,
};

let queryInfo = {
  deptId: -1,
  employeeName: '',
  phone: '',
  orderBy: 2,
};

let elist = [];

// 这个表格tbody
let tbData = document.getElementById('tbData');
// 查询条件
let txtQName = document.getElementById('txtQName');
let txtQPhone = document.getElementById('txtQPhone');
let btnQuery = document.getElementById('btnQuery');
let btnReset = document.getElementById('btnReset');
let selQOrder = document.getElementById('selQOrder');

btnReset.addEventListener('click', () => {
  txtQName.value = '';
  txtQPhone.value = '';
  selQOrder.value = 2;
  btnQDept.innerHTML = '选择部门';
  queryInfo.deptId = -1;
  page.pageNumber = 1;
  btnQuery.click();
});

btnQuery.addEventListener('click', () => {
  queryInfo.employeeName = txtQName.value;
  queryInfo.phone = txtQPhone.value;
  queryInfo.orderBy = selQOrder.value;
  page.pageNumber = 1;
  queryEmployee();
});

function queryEmployee() {
  let info = tools.concatJson(queryInfo, page);

  ajax.send('/manage/employee/queryAll', info, (data) => {
    if (data.success) {
      elist = data.list;
      page = data.page;
      showEmployee();
      showPage();
      return;
    }
    alert(data.message);
  });
}

function showEmployee() {
  tbData.innerHTML = '';
  for (let i = 0; i < elist.length; i++) {
    const emp = elist[i];
    let tr = document.createElement('tr');
    let td;
    // 所属部门
    td = document.createElement('td');
    td.append(emp.dept.deptName);
    tr.append(td);
    // 员工名称
    td = document.createElement('td');
    td.append(emp.employeeName);
    tr.append(td);
    // 员工手机
    td = document.createElement('td');
    td.append(emp.phone);
    tr.append(td);
    // 信息最后修改时间
    td = document.createElement('td');
    td.append(tools.formatDate(emp.lastupdate));
    tr.append(td);

    tbData.append(tr);
  }
}

// 分页的部分
let links = document.querySelectorAll('nav > a');
let spPage = document.querySelector('nav > span');
console.log('分页的链接：', links, spPage);

function showPage() {
  spPage.innerHTML = `
    总记录数/当前页/总页数
    ${page.total}/${page.pageNumber}/${page.pageCount}
  `;
}

// 第一页
links[0].addEventListener('click', () => {
  if (page.pageNumber == 1) {
    return;
  }
  page.pageNumber = 1;
  queryEmployee();
});

// 上一页
links[1].addEventListener('click', () => {
  page.pageNumber--;
  if (page.pageNumber < 1) {
    page.pageNumber = 1;
    return;
  }
  queryEmployee();
});

// 下一页
links[2].addEventListener('click', () => {
  page.pageNumber++;
  if (page.pageNumber > page.pageCount) {
    page.pageNumber = page.pageCount;
    return;
  }
  queryEmployee();
});

// 最后一页
links[3].addEventListener('click', () => {
  if (page.pageNumber == page.pageCount) {
    return;
  }
  page.pageNumber = page.pageCount;
  queryEmployee();
});

//#endregion

//#region 部门选择的部分
// 记录选择部门的模式（1：查询，2：添加，3：修改）
let mode = 1;

let dpage = {
  pageNumber: 1,
  pageSize: 5,
};

let dqueryInfo = {
  deptName: '',
};
let dlist = [];

let btnQDept = document.getElementById('btnQDept');
let txtDQuery = document.getElementById('txtDQuery');
let btnDFind = document.getElementById('btnDFind');
let tbDeptData = document.getElementById('tbDeptData');
let deptDialog = document.getElementById('deptDialog');
let btnCloseDept = document.getElementById('btnCloseDept');

function queryDept() {
  let info = tools.concatJson(dqueryInfo, dpage);
  ajax.send('/manage/dept/queryAll', info, (data) => {
    if (data.success) {
      dlist = data.list;
      dpage = data.page;
      showDept();
      return;
    }
    alert(data.message);
  });
}

function showDept() {
  tbDeptData.innerHTML = '';
  for (let i = 0; i < dlist.length; i++) {
    const dept = dlist[i];
    let tr = document.createElement('tr');
    let td;
    // 部门名称
    td = document.createElement('td');
    td.append(dept.deptName);
    tr.append(td);
    // 部门名称
    td = document.createElement('td');
    let btnSelect = document.createElement('button');
    btnSelect.append('选择此部门');
    btnSelect.addEventListener('click', () => {
      // 更改查询条件
      queryInfo.deptId = dept.deptId;
      // 更改部门的按钮信息
      btnQDept.innerHTML = `选择的部门：${dept.deptName}`;
      // 关闭对话框
      btnCloseDept.click();
    });

    td.append(btnSelect);
    tr.append(td);

    tbDeptData.append(tr);
  }
}

btnQDept.addEventListener('click', () => {
  queryDept();
  deptDialog.showModal();
});

btnDFind.addEventListener('click', () => {
  dpage.pageNumber = 1;
  dqueryInfo.deptName = txtDQuery.value;
  queryDept();
});

btnCloseDept.addEventListener('click', () => {
  // 触发表单提交动作
  document.querySelector('#deptDialog > form').submit();
});

//#endregion

//#region 添加的部分
let btnShowAdd = document.getElementById('btnShowAdd');
let addDialog = document.getElementById('addDialog');
let btnADept = document.getElementById('btnADept');
let txtAName = document.getElementById('txtAName');
let txtAPhone = document.getElementById('txtAPhone');
let btnAdd = document.getElementById('btnAdd');
let btnAClose = document.getElementById('btnAClose');
let addInfo = {};

btnShowAdd.addEventListener('click', () => {
  addInfo = {};
  btnADept.innerHTML = '部门选择';
  txtAName.value = '';
  txtAPhone.value = '';
  addDialog.showModal();
});

btnAClose.addEventListener('click', () => {
  document.querySelector('#addDialog form').submit();
});

btnADept.addEventListener('click', () => {
  queryDept();
  deptDialog.showModal();
});

//#endregion
queryEmployee();
