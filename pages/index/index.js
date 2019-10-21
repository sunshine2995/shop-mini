import * as UserService from '../../services/UserService';
import * as RouterUtil from '../../utils/RouterUtil';

const app = getApp();

Page({
  data: {
    motto: '菜巴士·送菜到家',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  bindUserInfo(nickName, headImg, iv, encryptedData) {
    UserService.bindUserInfo(nickName, headImg, iv, encryptedData)
      .then(() => {})
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
        });
      });
  },

  getUserInfo(e) {
    const iv = e.detail.iv;
    const encryptedData = e.detail.encryptedData;
    if (e.detail.userInfo) {
      const userInfo = e.detail.userInfo;
      app.globalData.userInfo = userInfo;
      this.setData({
        userInfo,
        hasUserInfo: true,
      });
      this.bindUserInfo(userInfo.nickName, userInfo.avatarUrl, iv, encryptedData);
    } else {
      wx.showToast({
        title: '残忍地拒绝了授权',
        icon: 'none',
      });
    }
    RouterUtil.back();
  },
});
