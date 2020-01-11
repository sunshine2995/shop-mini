import * as UserService from '../../../services/UserService';

Page({
  data: {
    couponList: [], // 充值赠礼列表
  },

  getNewYearCoupon() {
    wx.showLoading({
      title: '',
    });
    UserService.getNewYearCoupon()
      .then((res) => {
        wx.hideLoading();
        this.data.couponList = res.data.data;
        this.setData({
          couponList: this.data.couponList,
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

  getNewYearGift(e) {
    const couponName = e.currentTarget.dataset.couponName;
    UserService.getNewYearGift(couponName, 1)
      .then((res) => {
        wx.showToast({
          title: res.data.data.message,
          icon: 'none',
          duration: 2000,
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
    this.getNewYearCoupon();
  },
});
