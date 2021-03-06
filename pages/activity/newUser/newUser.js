import * as GiftService from '../../../services/GiftService';
import * as UserService from '../../../services/UserService';
import * as RouterUtil from '../../../utils/RouterUtil';

const app = getApp();
Page({
  data: {
    isNewUser: false,
    shipping: 0, // 免配送费条件
    ifGoBackApp: false,
    platform: '',
  },

  goToHome() {
    RouterUtil.go('/pages/home/home');
  },

  getshippingCharge() {
    UserService.getshippingCharge()
      .then((res) => {
        this.setData({
          shipping: +res.data.data.start_price,
        });
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000,
        });
      });
  },

  getNewUserEgg() {
    wx.showLoading({
      title: '领取中',
    });
    GiftService.getNewUserEgg()
      .then(() => {
        wx.hideLoading();
        this.data.isNewUser = false;
        this.setData({
          isNewUser: this.data.isNewUser,
        });
        wx.showToast({
          title: '领取成功',
          icon: 'none',
        });
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000,
        });
      });
  },

  getUser() {
    wx.showLoading({
      title: '',
    });
    UserService.getUser()
      .then((res) => {
        wx.hideLoading();
        this.data.isNewUser = res.data.data.is_new_user;
        this.setData({
          isNewUser: this.data.isNewUser,
        });
        this.getshippingCharge();
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000,
        });
      });
  },

  showTip() {
    wx.showToast({
      title: '请确保已经下载了app',
      icon: 'none',
      duration: 3000,
    });
  },

  onShow() {
    this.getUser();
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          platform: res.platform,
        });
      },
    });
    if ((app.globalData.scene == 1036 || app.globalData.scene == 1069) && this.data.platform !== 'ios') {
      this.setData({
        ifGoBackApp: true,
      });
    }
  },

  onShareAppMessage() {
    return {
      title: '新人首单免费领鸡蛋～',
      path: '/pages/activity/newUser/newUser',
    };
  },
});
