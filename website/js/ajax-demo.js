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
});
