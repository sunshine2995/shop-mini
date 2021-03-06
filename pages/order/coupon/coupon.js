import * as UserService from '../../../services/UserService';
import * as RouterUtil from '../../../utils/RouterUtil';

Page({
  data: {
    couponList: [],
    expiredCouponList: [],
    money: 0, // 订单金额
  },

  goCollectGood() {
    RouterUtil.go('/pages/recharge/recharge');
  },

  chooseCoupon(e) {
    const money = e.currentTarget.dataset.money;
    const couponId = e.currentTarget.dataset.couponId;
    RouterUtil.go(`/pages/order/submit/submit?money=${money}&couponId=${couponId}&fromPath=cart`);
  },

  getCouponsList() {
    UserService.getCouponsList(this.data.money)
      .then((res) => {
        wx.hideLoading();
        this.data.couponList = [...res.data.data.coupons_message_list, ...res.data.data.coupons_not_use_message_list];
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

  onLoad(options) {
    this.data.money = options.money;
  },

  onShow() {
    wx.showLoading({
      title: '',
    });
    this.getCouponsList();
  },
});
