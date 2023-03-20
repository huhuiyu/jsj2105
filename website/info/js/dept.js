import ajax from '../../js/ajax.js';
import tools from '../../js/tools.js';

console.log(tools.formatDate(new Date()));

let tbDept = document.getElementById('tbDept');
let txtDeptName = document.getElementById('txtDeptName');
let btnQuery = document.getElementById('btnQuery');
let btnReset = document.getElementById('btnReset');

// 通过css选择器获取页面元素
let spPages = document.querySelectorAll('#divPage > span');
console.log('选择器获取多个页面元素：', spPages);
let spPageInfo = document.querySelector('#divPage > span:nth-child(2)');
console.log('选择器获取单个页面元素：', spPageInfo);
let spPre = document.querySelector('#divPage > span:nth-child(1)');
let spNext = document.querySelector('#divPage > span:nth-child(3)');

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
    btnModify.append('修改');
    td.append(btnModify);
    btnModify.addEventListener('click', () => {
      console.log('要修改的信息：', dept);
      showModify(dept);
    });
    // 删除按钮
    let btnDel = document.createElement('button');
    btnDel.append('删除');
    td.append(btnDel);
    btnDel.addEventListener('click', () => {
      del(dept);
    });

    tr.append(td);
  }
}

function showPage() {
  console.log('分页信息：', page);
  // ``是模板字符串，可以多行，可以通过${变量名称}填入对应的变量值
  spPageInfo.innerHTML = `
      记录总数/当前页/总页数：
      ${page.total}/${page.pageNumber}/${page.pageCount}
    `;
  // '记录总数/当前页/总页数：'+page.total+'/'+page.pageNumber...
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

queryDept();

// 添加的部分 ===========================
let btnShowAdd = document.getElementById('btnShowAdd');
let dialogAdd = document.getElementById('dialogAdd');
let txtName = document.getElementById('txtName');
let txtInfo = document.getElementById('txtInfo');
let btnAdd = document.getElementById('btnAdd');

btnShowAdd.addEventListener('click', () => {
  dialogAdd.showModal();
});

btnAdd.addEventListener('click', () => {
  let info = {
    deptName: txtName.value,
    deptInfo: txtInfo.value,
  };

  ajax.send('/manage/dept/add', info, (data) => {
    alert(data.message);
    // 成功添加就重置表单
    if (data.success) {
      txtName.value = '';
      txtInfo.value = '';
    }
  });
});

// 修改部门信息的部分 ===========================、
let deptId = -1; // 要修改的部门编号
let dialogModify = document.getElementById('dialogModify');
let txtMName = document.getElementById('txtMName');
let txtMInfo = document.getElementById('txtMInfo');
let btnSave = document.getElementById('btnSave');

// 显示要修改的记录
function showModify(dept) {
  deptId = dept.deptId;
  txtMName.value = dept.deptName;
  txtMInfo.value = dept.deptInfo;
  dialogModify.showModal();
}

btnSave.addEventListener('click', () => {
  let minfo = {
    deptId: deptId,
    deptName: txtMName.value,
    deptInfo: txtMInfo.value,
  };
  ajax.send('/manage/dept/update', minfo, (data) => {
    alert(data.message);
  });
});

// 删除记录的部分
function del(dept) {
  if (confirm('是否删除：' + dept.deptName + '？')) {
    ajax.send(
      '/manage/dept/delete',
      {
        deptId: dept.deptId,
      },
      (data) => {
        alert(data.message);
        // 重新查询数据！！！
        page.pageNumber = 1;
        queryDept();
      }
    );
  }
}

// 添加/修改对话框关闭时要重新查询数据
dialogAdd.addEventListener('close', queryDept);
dialogModify.addEventListener('close', queryDept);

// 作业：和上课同步完成班级和学生的信息管理功能
