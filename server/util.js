
const fs = require('fs');
const path= require('path');

/**
 * 从缓存中移除module
 */
function removeModuleCache(moduleName) {
  // 遍历缓存来找到通过指定模块名载入的文件
  searchCache(moduleName, function (mod) {
    delete require.cache[mod.id];
  });

  // 删除模块缓存的路径
  Object.keys(module.constructor._pathCache).forEach(function(cacheKey) {
    if (cacheKey.indexOf(moduleName) >= 0) {
      delete module.constructor._pathCache[cacheKey];
    }
  });
};

/**
* 遍历缓存来查找通过特定模块名缓存下的模块
*/
function searchCache(moduleName, callback) {
  // 通过指定的名字resolve模块
  var mod = require.resolve(moduleName);

  // 检查该模块在缓存中是否被resolved并且被发现
  if (mod && ((mod = require.cache[mod]) !== undefined)) {
    // 递归的检查结果
    (function traverse(mod) {
      // 检查该模块的子模块并遍历它们
      mod.children.forEach(function (child) {
        traverse(child);
      });

      // 调用指定的callback方法，并将缓存的module当做参数传入
      callback(mod);
    }(mod));
  }
};

// 判断目录是否存在，不存在则创建
const touchDirList = (pathList) => {
  let dir = path.resolve();
  pathList.forEach(item => {
    dir += `/${item}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });
  return dir;
};

const writeFile = (pathList, filename, content) => {
  const dir = touchDirList(pathList);
  fs.writeFileSync(`${dir}/${filename}`, content);
};

const getAppCss = () => getCss('dist/server/css/app.css');

const getChunkCss = (url) => getCss(`dist/server/css/${url.split('/')[1]}-chunk.css`);

const getCss = (pathname) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(pathname), (error, content) => resolve(error ? '' : content));
  });
};

module.exports = {
  removeModuleCache,
  writeFile,
  touchDirList,
  getAppCss,
  getChunkCss,
};
