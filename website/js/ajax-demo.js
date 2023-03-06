import ajax from './ajax.js';

let txtEcho = document.getElementById('txtEcho');
let txtSend = document.getElementById('txtSend');
let spResult = document.getElementById('spResult');

txtSend.addEventListener('click', () => {
  ajax.send(
    '/',
    {
      echo: txtEcho.value,
    },
    (data) => {
      spResult.innerHTML = JSON.stringify(data);
    },
    'GET'
  );

  ajax.send(
    '/token',
    {},
    (data) => {
      console.log('token信息', data.token);
    },
    'GET'
  );
});

// 图片验证码演示
let imgCode = document.getElementById('imgCode');
let acode = document.getElementById('acode');

let txtCode = document.getElementById('txtCode');
let btnCode = document.getElementById('btnCode');

function getImageCode() {
  ajax.send('/tool/getImageCode', {}, (data) => {
    imgCode.setAttribute('src', data.message);
  });
}

imgCode.addEventListener('click', getImageCode);
acode.addEventListener('click', getImageCode);

getImageCode();

btnCode.addEventListener('click', () => {
  let code = txtCode.value;
  ajax.send(
    '/tool/checkImageCode',
    {
      code: code,
    },
    (data) => {
      console.log('验证是否正确：', data.success);
      alert(data.message);
    }
  );
});
