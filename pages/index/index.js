import * as UserService from '../../services/UserService';
import * as RouterUtil from '../../utils/RouterUtil';

//获取应用实例
const app = getApp();

Page({
  data: {
    motto: '菜巴士·送菜到家',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  login() {
    wx.login({
      success: (res) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          UserService.login(res.code).then((res) => {
            const token = res.data.data.token;
            wx.setStorageSync('token', token);
            RouterUtil.go('/pages/home/home');
          });
        }
      },
    });
  },
  getUserInfo: function(e) {
    RouterUtil.back();
  },
});
