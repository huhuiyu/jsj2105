import ajax from '../../js/ajax.js';
import tools from '../../js/tools.js';

// 查询的部分
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

queryEmployee();
