const GiftService = require('../../../services/GiftService.js');
const app = getApp();

Page({
  data: {
    myGiftList: [], // 赠礼列表
  },

  getMyGift() {
    wx.showLoading({
      title: '',
    });
    GiftService.getMyGift()
      .then((res) => {
        wx.hideLoading();
        this.data.myGiftList = res.data.data;
        this.setData({
          myGiftList: this.data.myGiftList,
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
    this.getMyGift();
  },
});
