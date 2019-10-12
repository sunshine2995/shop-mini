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
  bindUserInfo(nickName, headImg) {
    UserService.bindUserInfo(nickName, headImg)
      .then(() => {})
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
        });
      });
  },
  getUserInfo: function(e) {
    if (e.detail.userInfo) {
      const userInfo = e.detail.userInfo;
      app.globalData.userInfo = userInfo;
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true,
      });
      this.bindUserInfo(userInfo.nickName, userInfo.avatarUrl);
    } else {
      wx.showToast({
        title: '残忍地拒绝了授权',
        icon: 'none',
      });
    }
    RouterUtil.back();
  },
});
