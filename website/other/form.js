import qs from '../js/qs.js';

let txtId = document.getElementById('txtId');
let txtName = document.getElementById('txtName');
let btnSubmit = document.getElementById('btnSubmit');

btnSubmit.addEventListener('click', () => {
  let info = {
    id: txtId.value,
    name: txtName.value,
  };
  let qsinfo = qs.stringify(info);
  console.log(info, qsinfo);
  location.href = `submit.html?${qsinfo}`;
});
