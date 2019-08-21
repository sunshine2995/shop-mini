// pages/userCenter/customerService/customerService.js
const UserService = require('../../../utils/services/UseService.js');
var app = getApp();

Page({

  data: {
    phoneNumber: '',
    shopBusinessTime: '',
  },

  freeTell() {
    if (this.data.phoneNumber) {
      wx.makePhoneCall({
        phoneNumber: this.data.phoneNumber,
      })
    } else {
      wx.showToast({
        title: '店长没有设置电话',
        icon: 'none',
        duration: 2000
      });
    }
  }, 

  onShow() {
    this.data.phoneNumber = app.globalData.shopInfo.shop_contract;
    this.data.shopBusinessTime = app.globalData.shopInfo.shop_business_time;
    this.setData({
      phoneNumber: this.data.phoneNumber,
      shopBusinessTime: this.data.shopBusinessTime,
    });
  },
})