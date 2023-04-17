import { createApp } from '../lib/vue.esm-browser.js';

let app = createApp({
  data() {
    return {
      title: 'vue你好',
      username: '黑暗骑士',
      list: [
        { username: 'user', nickname: '内置用户', phone: '15080604020' },
        { username: 'DarkKnight', nickname: '黑暗骑士', phone: '15211301430' },
      ],
      modifyInfo: {},
      visible: false,
    };
  },
  methods: {
    showModify(info) {
      this.modifyInfo = info;
      this.visible = true;
    },
  },
});

app.mount('#app');
