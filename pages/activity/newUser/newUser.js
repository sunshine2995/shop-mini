// pages/activity/newUser/newUser.js
const app = getApp();
var GiftService = require('../../../utils/services/GiftService.js');

Page({
  data: {
    isNewUser: false,
  },

  goToHome() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },

  getNewUserEgg() {
    wx.showLoading({
      title: '领取中',
    })
    GiftService.getNewUserEgg()
      .then((res) => {
        wx.hideLoading();
        this.data.isNewUser = false;
        this.setData({
          isNewUser: this.data.isNewUser,
        })
        wx.showToast({
          title: '领取成功',
          icon: 'none',
        })
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000
        })
      });
  },  

  onShow () {
    this.data.isNewUser = app.globalData.userData.is_new_user;
    this.setData({
      isNewUser: this.data.isNewUser,
    })
  },
})