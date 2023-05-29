import qs from '../js/qs.js';

let div = document.querySelector('div');
let pre = document.querySelector('pre');
let info = location.search;
if (info.length > 0) {
  div.append(info.substring(1));
  let qsinfo = qs.parse(info.substring(1));
  console.log(qsinfo);
  pre.append(JSON.stringify(qsinfo, null, 2));
} else {
  div.append('没有查询字符串');
  pre.append('没有查询字符串');
}

// 扩展知识，通过字符串来分析查询参数
let strQs = '?id=111&name=darknight&sex=m';
// 去掉?
strQs = strQs.substring(1);
console.log('1:', strQs);
// 分离多个参数（规律是&）
let strs = strQs.split('&');
console.log('2:', strs);
// 分离参数的值和key（规律是=）
let jsonObj = {};
strs.forEach((item, i) => {
  console.log(item, i);
  let items = item.split('=');
  console.log(items[0], items[1]);
  jsonObj[items[0]] = items[1];
});

console.log(jsonObj);
