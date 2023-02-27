import axios from './axios.min.js';
import md5 from './md5.min.js';
import qs from './qs.js';

console.log(
  md5.hash('abc'),
  qs.stringify({ info: { id: 123, name: '黑暗骑士' } }, { allowDots: true }),
  qs.parse('info.id=123&info.name=黑暗骑士', { allowDots: true })
);

axios({
  url:
    'https://service.huhuiyu.top/teach_project_service/?' +
    qs.stringify({ echo: '黑暗骑士' }, { allowDots: true }),
  method: 'get',
})
  .then((resp) => {
    console.log('应答结果：', resp);
  })
  .catch((err) => {
    console.error('请求错误', err);
  });
