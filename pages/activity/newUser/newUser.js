import * as GiftService from '../../../services/GiftService';
import * as UserService from '../../../services/UserService';
import * as RouterUtil from '../../../utils/RouterUtil';

const app = getApp();

Page({
  data: {
    isNewUser: false,
    shipping: 0, // 免配送费条件
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

  onShow() {
    this.getshippingCharge();
    this.data.isNewUser = app.globalData.userData.is_new_user;
    this.setData({
      isNewUser: this.data.isNewUser,
    });
  },
});
