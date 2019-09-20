function wxPromise(method, url, data) {
  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: {
        "Content-Type": "application/json",
        'Authorization': wx.getStorageSync('token'),
      },
      success: function(res) {
        // setTimeout(function() {
          // wx.hideLoading();
        // }, 100);
        if (res.data.code == 200 || res.data.infocode == 10000) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function(res) {
        // setTimeout(function() {
          // wx.hideLoading();
        // }, 100);
        reject(res);
      }
    });
  });
}

module.exports = {
  wxPromise: wxPromise
}