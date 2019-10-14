import * as UserService from '../../services/UserService';
import * as RouterUtil from '../../utils/RouterUtil';

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
              // RouterUtil.go('/pages/home/home');
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
