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
          wx.navigateTo({
            url: '/pages/login/login',
          });
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
