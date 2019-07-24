
const { isClient } = require('../../config/env');

let request;

if (isClient) {
  request = ({ method = 'GET', url, body = {} }) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.timeout = 5000;
      xhr.responseType = 'json';
      xhr.open(method, url, true);
      if (method === 'POST') {
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      }
      xhr.onload = function(e) {
        if (this.status === 200 || this.status === 304) {
          resolve(xhr.response);
        }
      };
      xhr.ontimeout = function(e) {
        reject('timeout');
      };
      xhr.onerror = function(e) {
        reject('请求失败');
      };
      xhr.send(body);
    });
  };
} else {
  const req = require('request');

  request = ({ method = 'GET', url, body = {} }) => {
    return new Promise((resolve, reject) => {
      req({ url, method, body, json: true }, (err, res, body) => {
        if (err) {
          return reject(err);
        }
        resolve(body);
      });
    });
  };
}

const get = (url) => {
  return request({ url });
};

module.exports = {
  get,
};