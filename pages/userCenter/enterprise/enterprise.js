const app = getApp();

Page({
  data: {
    phoneNumber: '',
  },

  onShow() {
    this.data.phoneNumber = app.globalData.shopInfo.shop_contact_phone;
    this.setData({
      phoneNumber: this.data.phoneNumber,
    });
  },
});
