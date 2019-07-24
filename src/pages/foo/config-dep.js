
module.exports = [{
  path: '/foo/:id',
  // ssr: false, // default: true
  ssrConfig: {
    rpsLimit: 300, // 每秒请求超过 300 次就切换到客户端渲染
  },
  getInitData() {
    console.log('get init data');
  },
}];