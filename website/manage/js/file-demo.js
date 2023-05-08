import ajax from '../../js/ajax.js';
import tools from '../../js/tools.js';

let file1 = document.getElementById('file1');
let sp1 = document.getElementById('sp1');
// 多选
file1.multiple = false;
// 文件类型
// file1.accept='image/*'

// 获取文件框选中的文件
file1.addEventListener('change', () => {
  console.log('选中文件事件', file1.files);
  if (file1.files.length < 1) {
    return;
  }
  let file = file1.files[0];
  sp1.innerHTML = `${file.name},${file.size}`;
});

// file1.addEventListener('cancel', () => {
//   console.log('取消事件');
// });

// file1.addEventListener('close', () => {
//   console.log('关闭事件');
// });

// 虚拟文件浏览
let btn2 = document.getElementById('btn2');
let sp2 = document.getElementById('sp2');

btn2.addEventListener('click', () => {
  let efile = document.createElement('input');
  efile.setAttribute('type', 'file');

  efile.addEventListener('change', () => {
    if (efile.files.length < 1) {
      return;
    }
    let file = efile.files[0];
    sp2.innerHTML = `${file.name},${file.size}`;
  });

  efile.click();
});

// 文件公用方法
let btn3 = document.getElementById('btn3');
let sp3 = document.getElementById('sp3');
let txtFileinfo = document.getElementById('txtFileinfo');
let btn4 = document.getElementById('btn4');
let file = null;

btn3.addEventListener('click', () => {
  file = null;
  sp3.innerHTML = '';
  tools.openFile((efile) => {
    console.log('选中的文件：', efile);
    if (efile) {
      file = efile;
      sp3.innerHTML = `选中的文件:"${efile.name}"`;
    }
  });
});

btn4.addEventListener('click', () => {
  if (!file) {
    alert('请选择文件');
    return;
  }
  if (file.size > 2 * 1000 * 1000) {
    alert('文件超过大小');
    return;
  }

  ajax.sendFile(file, txtFileinfo.value, (data) => {
    if (data.success) {
      alert(JSON.stringify(data.data, null, 2));
      file = null;
      sp3.innerHTML = '';
    } else {
      alert(data.message);
    }
  });
});

ajax.send('/user/file/queryAll', {}, (data) => {
  console.log('文件信息：', data);
});
