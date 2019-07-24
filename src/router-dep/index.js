'use strict';

import router from './routerExports';

const serverRouterConfig = {};
const routerConfig = [];

router.forEach(routerItem => {
  serverRouterConfig[routerItem.path] = {
    ssr: routerItem.ssr,
    ssrConfig: routerItem.ssrConfig,
    getInitData: routerItem.getInitData,
  };
  routerConfig.push({
    path: routerItem.path,
    component: routerItem.component,
  });
});

export {
  serverRouterConfig,
  routerConfig,
};