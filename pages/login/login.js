// pages/login/login.js
const http = require('../../services/http.js');
const utilMd5 = require('../../utils/md5.js');
const BaseUrl = http.BaseUrl;

// const getTime = () => Math.floor(Date.now() / 1000);

// const generateSignature = (timestamp) => {
//   const password = `${timestamp}.Caibasi168`;
//   return utilMd5.hexMD5(password);
// };

// const timestamp = getTime();
// const signature = generateSignature(timestamp);

Page({
  data: {},

  login() {
    wx.login({
      success: (res) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.request({
            method: 'POST',
            url: `${BaseUrl}/wxapp/login`,

            header: {
              // 'content-type': 'application/x-www-form-urlencoded',
              // Timestamp: timestamp,
              // Signature: signature,
            },
            data: {
              code: res.code,
            },
            success: (res) => {
              const token = res.data.data.token;
              // console.log(token, 'fff');
              wx.setStorageSync('token', token);
              wx.switchTab({
                url: '../home/home',
              });
            },
            fail: (error) => {
              wx.showToast({
                title: error,
                icon: 'none',
              });
            },
          });
        }
      },
    });
  },
  onShow() {
    this.login();
  },
});
