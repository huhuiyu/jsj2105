import ajax from './ajax.js';
import tools from './tools.js';

//#region  查询员工数据的部分
// 查询参数
let queryInfo = {
  deptId: -1,
  employeeName: '',
  orderBy: '2',
  phone: '',
};

// 分页参数
let page = {
  pageNumber: 1,
  pageSize: 5,
};

// 员工列表
let elist = [];

// 查询员工的方法
function queryEmployee() {
  ajax.send(
    '/manage/employee/queryAll',
    tools.concatJson(queryInfo, page),
    (data) => {
      if (data.success) {
        page = data.page;
        elist = data.list;
        showEmployee();
        showPage();
        return;
      }
      showAlert(data.message);
    }
  );
}

let tbData = document.getElementById('tbData');

// 显示员工的方法
function showEmployee() {
  tbData.innerHTML = '';

  for (let i = 0; i < elist.length; i++) {
    let emp = elist[i];
    let tr = document.createElement('tr');
    tbData.append(tr);
    let td;

    td = document.createElement('td');
    td.append(emp.dept.deptName);
    tr.append(td);

    td = document.createElement('td');
    td.append(emp.employeeName);
    tr.append(td);

    td = document.createElement('td');
    td.append(emp.phone);
    tr.append(td);
  }
}

let epages = document.querySelectorAll('#epage > span');

// 显示分页的部分
function showPage() {
  epages[1].innerHTML = `
    记录数/总页数/当前页：
    ${page.total}/${page.pageCount}/${page.pageNumber}
  `;
}
// 上一页
epages[0].addEventListener('click', () => {
  page.pageNumber--;
  if (page.pageNumber < 1) {
    page.pageNumber = 1;
    return;
  }
  queryEmployee();
});

// 下一页
epages[2].addEventListener('click', () => {
  page.pageNumber++;
  if (page.pageNumber > page.pageCount) {
    page.pageNumber = page.pageCount;
    return;
  }
  queryEmployee();
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

//#region 部门查询的部分
let deptQueryInfo = {
  deptName: '',
};

let deptPage = {
  pageNumber: 1,
  pageSize: 5,
};

let dlist = [];

// 部门选择的模式，1是查询用，2是添加，3是修改
let mode = 1;

let tbDept = document.getElementById('tbDept');
let deptDialog = new bootstrap.Modal('#deptDialog');

function queryDept() {
  ajax.send(
    '/manage/dept/queryAll',
    tools.concatJson(deptQueryInfo, deptPage),
    (data) => {
      if (data.success) {
        deptPage = data.page;
        dlist = data.list;
        showDept();
        showDPage();
        return;
      }
      showAlert(data.message);
    }
  );
}

function showDept() {
  tbDept.innerHTML = '';

  for (let i = 0; i < dlist.length; i++) {
    let dept = dlist[i];
    let tr = document.createElement('tr');
    let td;

    td = document.createElement('td');
    td.append(dept.deptName);
    tr.append(td);

    td = document.createElement('td');
    let btn = document.createElement('button');
    btn.classList.add('btn', 'btn-primary', 'sm');

    btn.append('选择');
    td.append(btn);
    tr.append(td);

    btn.addEventListener('click', () => {
      if (mode == 2) {
        // 添加模式
        addInfo.deptId = dept.deptId;
        spADept.innerHTML = dept.deptName;
        // 关闭部门对话框，并显示添加对话框
        deptDialog.toggle();
        addDialog.toggle();
      }
    });

    tbDept.append(tr);
  }
}

let dpages = document.querySelectorAll('#dpage > span');

function showDPage() {
  dpages[1].innerHTML = `
  记录数/总页数/当前页：
  ${deptPage.total}/${deptPage.pageCount}/${deptPage.pageNumber}
  `;
}

// 上一页
dpages[0].addEventListener('click', () => {
  deptPage.pageNumber--;
  if (deptPage.pageNumber < 1) {
    deptPage.pageNumber = 1;
    return;
  }
  queryDept();
});

// 下一页
dpages[2].addEventListener('click', () => {
  deptPage.pageNumber++;
  if (deptPage.pageNumber > deptPage.pageCount) {
    deptPage.pageNumber = deptPage.pageCount;
    return;
  }
  queryDept();
});

//#endregion

//#region 添加的部分
let btnShowAdd = document.getElementById('btnShowAdd');
let btnADept = document.getElementById('btnADept');
let spADept = document.getElementById('spADept');
let txtAName = document.getElementById('txtAName');
let txtAPhone = document.getElementById('txtAPhone');
let btnAdd = document.getElementById('btnAdd');

let addDialog = new bootstrap.Modal('#addDialog');

let addInfo = {
  deptId: -1,
  employeeName: '',
  phone: '',
};

btnShowAdd.addEventListener('click', () => {
  mode = 2;
  queryDept();
});

btnAdd.addEventListener('click', () => {
  addInfo.employeeName = txtAName.value;
  addInfo.phone = txtAPhone.value;

  ajax.send('/manage/employee/add', addInfo, (data) => {
    showAlert(data.message);
  });
});

//#endregion

queryEmployee();
