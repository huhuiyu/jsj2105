import ajax from '../../js/ajax.js';
import tools from '../../js/tools.js';

console.log(tools.formatDate(new Date()));

let tbDept = document.getElementById('tbDept');

let deptList = [];

function queryDept() {
  ajax.send('/manage/dept/queryAll', {}, (data) => {
    if (data.success) {
      deptList = data.list;
      console.log('部门列表', deptList);
      showDept();
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
    td.append( 
      tools.formatDate(dept.lastupdate ,'yyyy年MM月dd日 hh:mm:ss' )  );
    tr.append(td);
  }
}

queryDept();
