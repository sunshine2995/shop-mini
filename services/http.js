const wxRequest = require('../utils/wxRequest.js');

export function get(url, data) {
  return wxRequest.wxPromise('GET', url, data);
}

export function post(url, data) {
  return wxRequest.wxPromise('POST', url, data);
}

export function delete_(url, data) {
  return wxRequest.wxPromise('DELETE', url, data);
}

export function put(url, data) {
  return wxRequest.wxPromise('PUT', url, data);
}
