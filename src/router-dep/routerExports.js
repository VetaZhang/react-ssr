"use strict";

import loadable from '@loadable/component';
import foo from '../pages/foo/config';
console.log(foo);
let list = [];
list.push(Object.assign(foo, { component: loadable(() => import(/* webpackChunkName: 'foo' */ '../pages/foo'))}));

// module.exports = list;
export default list;
