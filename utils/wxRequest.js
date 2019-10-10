import * as RouterUtil from '../utils/RouterUtil';

export function wxPromise(method, url, data, header) {
  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: header,
      success: function(res) {
        if (res.data.code == 200 || res.data.infocode == 10000) {
          resolve(res);
        } else if (res.data.code == 401) {
          RouterUtil.go('/pages/login/login');
        } else {
          reject(res);
        }
      },
      fail: function(res) {
        reject(res);
      },
    });
  });
}
