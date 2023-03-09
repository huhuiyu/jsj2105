import ajax from '../../js/ajax.js';

let selProvince = document.getElementById('selProvince');
let selCity = document.getElementById('selCity');

// 查询省份信息
function queryProvince() {
  ajax.send('/linkinfo/queryAllProvince', {}, (data) => {
    if (data.success) {
      let list = data.list;
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
