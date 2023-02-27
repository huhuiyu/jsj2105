let tools = {
  info: '黑暗骑士的工具类',
  formatDate: (ts) => {
    let date = new Date();
    date.setTime(ts);
    return date.getFullYear() + '年' + (date.getMonth() + 1) + '月';
  },
};

let serverInfo = {
  baseUrl: 'https://huhuiyu.top',
};

// 导出模块的默认对象
export default tools;
// 导出多个对象
export { tools as tools, serverInfo as serverInfo };
