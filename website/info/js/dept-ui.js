import ajax from '../../js/ajax.js';
import tools from '../../js/tools.js';

//#region 查询的部分
let tbDept = document.getElementById('tbDept');
let txtDeptName = document.getElementById('txtDeptName');
let btnQuery = document.getElementById('btnQuery');
let btnReset = document.getElementById('btnReset');

let deptList = [];

let page = {
  pageNumber: 1,
  pageSize: 5,
};

let queryInfo = {
  deptName: '',
};

function queryDept() {
  let param = tools.concatJson(queryInfo, page);
  console.log('合并参数的结果', param);
  ajax.send('/manage/dept/queryAll', param, (data) => {
    if (data.success) {
      deptList = data.list;
      // 更新分页信息为服务器端的值
      page = data.page;
      console.log('部门列表', deptList);
      showDept();
      showPage();
    }
  });
}

function showDept() {
  tbDept.innerHTML = '';
  // 循环添加到表格中
  for (let i = 0; i < deptList.length; i++) {
    let dept = deptList[i];
    let tr = document.createElement('tr');
    let td;
    tbDept.append(tr);
    // 编号
    td = document.createElement('td');
    td.append(dept.deptId);
    tr.append(td);

    // 部门名称
    td = document.createElement('td');
    td.append(dept.deptName);
    tr.append(td);

    // 部门信息
    td = document.createElement('td');
    td.append(dept.deptInfo);
    tr.append(td);

    // 信息最后修改时间
    td = document.createElement('td');
    td.append(tools.formatDate(dept.lastupdate, 'yyyy年MM月dd日 hh:mm:ss'));
    tr.append(td);

    // 操作列
    td = document.createElement('td');
    // 修改按钮
    let btnModify = document.createElement('button');
    btnModify.classList.add('btn', 'btn-primary', 'btn-sm');
    btnModify.append('修改');
    td.append(btnModify);

    // 删除按钮
    let btnDel = document.createElement('button');
    btnDel.classList.add('btn', 'btn-danger', 'btn-sm');
    btnDel.append('删除');
    td.append(btnDel);

    tr.append(td);
  }
}

btnQuery.addEventListener('click', () => {
  // 查询条件变化，页码要回到1
  page.pageNumber = 1;
  // 设置查询条件
  queryInfo.deptName = txtDeptName.value;
  // 启动查询
  queryDept();
});

btnReset.addEventListener('click', () => {
  // 重置页面
  txtDeptName.value = '';
  // 触发查询按钮功能
  btnQuery.click();
});

// 通过css选择器获取页面元素
let spPages = document.querySelectorAll('#divPage > li > a');
console.log('选择器获取多个页面元素：', spPages);
let spPageInfo = spPages[1];
let spPre = spPages[0];
let spNext = spPages[2];

function showPage() {
  console.log('分页信息：', page);
  // ``是模板字符串，可以多行，可以通过${变量名称}填入对应的变量值
  spPageInfo.innerHTML = `
      记录总数/当前页/总页数：
      ${page.total}/${page.pageNumber}/${page.pageCount}
    `;
  // '记录总数/当前页/总页数：'+page.total+'/'+page.pageNumber...
}

// 分页导航
spPre.addEventListener('click', () => {
  page.pageNumber--;
  if (page.pageNumber < 1) {
    page.pageNumber = 1;
    return;
  }
  queryDept();
});

spNext.addEventListener('click', () => {
  page.pageNumber++;
  if (page.pageNumber > page.pageCount) {
    page.pageNumber = page.pageCount;
    return;
  }
  queryDept();
});

//#endregion

queryDept();
