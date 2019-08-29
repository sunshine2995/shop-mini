// pages/userCenter/couponList/coupon.js
let UserService = require('../../../utils/services/UseService.js');

Page({

  data: {
    couponList: [],
    expiredCouponList: [],
  },

  goCollectGood() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },

  onLoad: function(options) {
    // 页面创建时执行
    console.log(options, 'options')
  },

  onShow: function() {
    wx.showLoading({
      title: '',
    })
    this.getMyCoupons();
  },

  getMyCoupons() {
    UserService.getMyCoupons()
      .then((res) => {
        wx.hideLoading();
        this.data.couponList = res.data.data.coupons_message_list;
        this.data.expiredCouponList = res.data.data.expired_coupons_message_list;
        this.setData({
          couponList: this.data.couponList,
          expiredCouponList: this.data.expiredCouponList,
        });
      })
      .catch(() => {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      })
  },

})