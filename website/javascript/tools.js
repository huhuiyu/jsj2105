// 公用的js
function formatDate(ts) {
  let date = new Date();
  date.setTime(ts);
  return date.getFullYear() + '年' + (date.getMonth() + 1) + '月';
}
