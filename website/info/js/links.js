import ajax from '../../js/ajax.js';

let selProvince = document.getElementById('selProvince');
let selCity = document.getElementById('selCity');

let plist = [];
let clist = [];

// 查询省份信息
function queryProvince() {
  ajax.send('/linkinfo/queryAllProvince', {}, (data) => {
    if (data.success) {
      let list = data.list;
      plist = list;
      for (let i = 0; i < list.length; i++) {
        let p = list[i];
        console.log('省份：', p);
        // 添加到select
        let op = document.createElement('option');
        op.setAttribute('value', p.pid);
        op.append(p.province);
        selProvince.append(op);
      }
      selProvince.selectedIndex = parseInt(list.length / 2);
      queryCity();
    } else {
      alert(data.message);
    }
  });
}

// 城市查询
function queryCity() {
  let pid = selProvince.value;
  ajax.send(
    '/linkinfo/queryCityByProvince',
    {
      pid: pid,
    },
    (data) => {
      if (!data.success) {
        alert(data.message);
        return;
      }
      // 清空原来的城市信息
      selCity.innerHTML = '';
      let list = data.list;
      clist = list;
      if (list.length <= 0) {
        return;
      }
      // 循环生成选项
      for (let i = 0; i < list.length; i++) {
        let c = list[i];
        let op = document.createElement('option');
        op.setAttribute('src', c.cid);
        op.append(c.city);
        selCity.append(op);
      }
      selCity.selectedIndex = 0;
    }
  );
}

selProvince.addEventListener('change', queryCity);

queryProvince();

// 显示选中的值
let btnOk = document.getElementById('btnOk');
let spInfo = document.getElementById('spInfo');

btnOk.addEventListener('click', () => {
  spInfo.innerHTML = '';

  // 判定有没有选中省
  if (selProvince.selectedIndex > -1) {
    // 获取选中的省份
    let p = plist[selProvince.selectedIndex];
    spInfo.append(p.province);
  }
  // 判定有没有选中城市
  if (selCity.selectedIndex > -1) {
    let c = clist[selCity.selectedIndex];
    spInfo.append(c.city);
  }
});
