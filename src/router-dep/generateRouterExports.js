'use strict';

const fs = require('fs');
const path = require('path');

const pagesDir = path.resolve('src/pages');
let serverConfigOutput = '"use strict";\n\n';
// let routerOutput = '"use strict";\n\nimport loadable from \'@loadable/component\';\n\nlet list = [];\n\n';

fs.readdir(pagesDir, (err, dirs) => {
  if (err) {
    console.error(err);
  } else {
    dirs.forEach(dir => {
      const isDir = fs.statSync(`${pagesDir}/${dir}`).isDirectory();
      if (isDir) {
        serverConfigOutput += `const ${dir} = require('../pages/${dir}/config');\n`;
        // routerOutput += `import ${dir} from '../pages/${dir}/config';\n`;
      }
    });

    serverConfigOutput += `\nexport default [].concat(${dirs.join(', ')})`;

    // dirs.forEach(dir => {
    //   const isDir = fs.statSync(`${pagesDir}/${dir}`).isDirectory();
    //   if (isDir) {
    //     routerOutput += `\nlist.push({ path: ${dir}, component: loadable(() => import(/* webpackChunkName: '${dir}' */ './pages/${dir}'))});\n`;
    //   }
    // });
    // output += `\nmodule.exports = list;\n`;

    fs.writeFileSync(path.resolve('src/router/routerExports.js'), output);
  }
});