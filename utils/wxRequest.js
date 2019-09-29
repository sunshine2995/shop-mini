const utilMd5 = require('./md5.js');
function wxPromise(method, url, data) {
  // const getTime = () => Math.floor(Date.now() / 1000);

  // const generateSignature = (timestamp) => {
  //   const password = `${timestamp}.Caibasi168`;
  //   return utilMd5.hexMD5(password);
  // };

  // const timestamp = getTime();
  // const signature = generateSignature(timestamp);
  return new Promise(function(resolve, reject) {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/json',
        Authorization: wx.getStorageSync('token'),
        // Timestamp: timestamp,
        // Signature: signature,
      },
      success: function(res) {
        // setTimeout(function() {
        // wx.hideLoading();
        // }, 100);
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
        // setTimeout(function() {
        // wx.hideLoading();
        // }, 100);
        reject(res);
      },
    });
  });
}

module.exports = {
  wxPromise: wxPromise,
};
