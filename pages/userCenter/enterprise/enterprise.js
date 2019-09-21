// pages/userCenter/enterprise/enterprise.js
const UserService = require('../../../utils/services/UserService.js');

var app = getApp();
Page({
  data: {
    phoneNumber: '',
  },

  onLoad: function(options) {},

  onShow: function() {
    this.data.phoneNumber = app.globalData.shopInfo.shop_contact_phone;
    this.setData({
      phoneNumber: this.data.phoneNumber,
    });
  },
});
