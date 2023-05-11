import qs from './qs.js';
import axios from './axios.min.js';

// 后端基础地址
const BASE_URL = 'https://service.huhuiyu.top/teach_project_service';
// token本地保存的key
const TOKEN_KEY = 'teach_project_token_key';

// 保存应答数据中的token
function saveToken(data) {
  if (data && data.token) {
    localStorage.setItem(TOKEN_KEY, data.token);
  }
}
// 读取本地保存的token
function loadToken() {
  let token = localStorage.getItem(TOKEN_KEY);
  return token ? token : '';
}

const ajax = {
  // 发送ajax请求,1：请求的地址，2：请求的参数（json）
  // 3：应答结果的处理（回调）function
  // 4：可选参数，默认为POST，请求的方式
  send: (url, params, callback, method = 'POST') => {
    // 处理请求的参数
    let request = qs.stringify(params, { allowDots: true });
    // 完整的请求地址
    let rurl = BASE_URL + url;
    // get请求是通过url发送
    if ('get' == method.toLowerCase()) {
      rurl = rurl + '?' + request;
      request = '';
    }
    // 发起ajax请求
    let promise = axios({
      url: rurl,
      data: request,
      method: method,
      headers: {
        token: loadToken(),
      },
    });
    // 请求的结果
    promise
      .then((resp) => {
        // 正确应答的情况
        console.log('应答的结果：', resp.data);
        // 保存token
        saveToken(resp.data);
        // 回调处理
        callback(resp.data);
      })
      .catch((err) => {
        // 处理发生错误的情况
        console.error('应答错误：', err);
        // 回调处理
        callback({ success: false, message: '请求发生错误' });
      });
  },
  // ajax的文件上传需要单独处理
  sendFile: (file, fileinfo, callback) => {
    let url = BASE_URL + '/user/file/upload';
    // 参数必须通过FormData对象传递
    let formdata = new FormData();
    formdata.append('file', file);
    formdata.append('fileinfo', fileinfo);

    // 发起ajax请求
    let promise = axios({
      url: url,
      method: 'POST',
      data: formdata,
      headers: {
        token: loadToken(),
        'Content-Type': 'multipart/form-data',
      },
    });

    // 请求的结果
    promise
      .then((resp) => {
        // 正确应答的情况
        console.log('应答的结果：', resp.data);
        // 保存token
        saveToken(resp.data);
        // 回调处理
        callback(resp.data);
      })
      .catch((err) => {
        // 处理发生错误的情况
        console.error('应答错误：', err);
        // 回调处理
        callback({ success: false, message: '请求发生错误' });
      });
  },
  // 获取下载文件的url
  getFileUrl: (fid) => {
    return `${BASE_URL}/user/file/download?fid=${fid}`;
  },
  // 通过url地址获取fid信息
  getFileUrlFid: (url) => {
    return url.replace(BASE_URL + '/user/file/download?fid=', '');
  },
  // 判定是否为文件下载地址
  isFileUrl: (url) => {
    return url.startsWith(BASE_URL + '/user/file/download?fid=');
  },
};

export default ajax;

export { ajax as ajax };
