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

btn3.addEventListener('click', () => {
  tools.openFile((file) => {
    console.log('选中的文件：', file);
  });
});
