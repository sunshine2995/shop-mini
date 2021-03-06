import * as UserService from '../../services/UserService';

Page({
  login() {
    wx.login({
      success: (res) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          UserService.login(res.code)
            .then((res) => {
              const token = res.data.data.token;
              wx.setStorageSync('token', token);
              wx.navigateBack({
                delta: 1,
              });
            })
            .catch((error) => {
              wx.showToast({
                title: error,
                icon: 'none',
              });
            });
        }
      },
    });
  },

  onShow() {
    this.login();
  },
});
