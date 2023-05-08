// 公用的工具类
let tools = {
  // 格式化日期（时间戳）
  formatDate: (date, format) => {
    // 格式默认为'yyyy-MM-dd'
    format = format ? format : 'yyyy-MM-dd hh:mm:ss';
    // 不是标准的日期格式数据，就一定是时间戳
    if (typeof date != 'Date') {
      // 时间戳转换为日期对象
      let dateinfo = new Date();
      dateinfo.setTime(date);
      date = dateinfo;
    }
    console.log('格式化参数', date, format);
    // 格式化
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    // 通过正则表达式替换
    let result = format.replace(/yyyy/g, year);
    result = result.replace(/MM/g, month);
    result = result.replace(/dd/g, day);
    result = result.replace(/hh/g, hour);
    result = result.replace(/mm/g, minute);
    result = result.replace(/ss/g, second);
    return result;
  },
  // 合并多个json为一个，...表示不定长参数
  concatJson: (...jsons) => {
    let result = {};
    for (let i = 0; i < jsons.length; i++) {
      let json = jsons[i];
      // json特有的key循环
      for (let key in json) {
        console.log(key, json[key]);
        // 复制给result
        result[key] = json[key];
      }
    }
    return result;
  },
  // 获取文件，通过回调函数返回选中的文件
  openFile: (cb) => {
    let efile = document.createElement('input');
    efile.setAttribute('type', 'file');

    efile.addEventListener('change', () => {
      // 用户有选中文件的情况
      if (efile.files && efile.files.length > 0) {
        // 将文件通过回调函数回传
        cb(efile.files[0]);
      }
    });

    efile.click();
  },
};

let info = {};

export default tools;

export { tools as tools, info as info };
