
const { get } = require('../src/utils/request')

const configs = {
  '/foo/:id': {
    // ssr: false,
    // getInitialData() {
    //   return get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
    //     .then(res => res.url)
    //     .catch(err => console.log(err));
    // },
  },
};

const routerList = Object.entries(configs);

const isMatch = (path1, path2) => {
  const list1 = path1.split('/');
  const list2 = path2.split('/');
  if (list1.length === list2.length) {
    for (let i = 0; i < list1.length; i++) {
      if (list1[i].includes(':')) {
        continue;
      } else if (list1[i] !== list2[i]) {
        return false;
      }
    }
    return true;
  }
  return false;
};

module.exports = (path) => {
  if (configs[path]) {
    return { router: path, config: configs[path] };
  } else {
    for (const item of routerList) {
      const [pathname, config] = item;
      if (isMatch(pathname, path)) {
        return { router: pathname, config };
      }
    }
    return { router: path, config: {} };;
  }
};