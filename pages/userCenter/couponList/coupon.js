// pages/userCenter/couponList/coupon.js
import * as UserService from '../../../services/UserService';
import * as RouterUtil from '../../../utils/RouterUtil';

Page({
  data: {
    couponList: [],
    expiredCouponList: [],
  },

  goCollectGood() {
    RouterUtil.go('/pages/recharge/recharge');
  },

  goToSort() {
    RouterUtil.go('/pages/sort/sort');
  },

  onShow: function() {
    wx.showLoading({
      title: '',
    });
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
          duration: 2000,
        });
      });
  },
});
