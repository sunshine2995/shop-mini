const app = getApp();

Page({
  data: {
    phoneNumber: '',
  },

  onShow: function() {
    this.data.phoneNumber = app.globalData.shopInfo.shop_contract;
    this.setData({
      phoneNumber: this.data.phoneNumber,
    });
  },
});
