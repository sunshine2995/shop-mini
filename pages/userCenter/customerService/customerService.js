// pages/userCenter/customerService/customerService.js
import * as UserService from '../../../services/UserService';

var app = getApp();

Page({
  data: {
    phoneNumber: '',
    shopBusinessTime: '',
    customImgs: [],
  },

  freeTell() {
    if (this.data.phoneNumber) {
      wx.makePhoneCall({
        phoneNumber: this.data.phoneNumber,
      });
    } else {
      wx.showToast({
        title: '店长没有设置电话',
        icon: 'none',
        duration: 2000,
      });
    }
  },

  getCustom() {
    wx.showLoading({
      title: '加载中',
    });
    UserService.getCustom()
      .then((res) => {
        wx.hideLoading();
        const imgData = res.data.data;
        imgData.forEach((item) => {
          if (item.module_name === '客服页') {
            this.data.customImgs.push({ img_url: item.img_url, mini_turn_url: item.mini_turn_url });
          }
        });
        this.setData({
          customImgs: this.data.customImgs,
        });
      })
      .catch((res) => {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000,
        });
      });
  },

  onShow() {
    this.data.phoneNumber = app.globalData.shopInfo.shop_contract;
    this.data.shopBusinessTime = app.globalData.shopInfo.shop_business_time;
    this.getCustom();
    this.setData({
      phoneNumber: this.data.phoneNumber,
      shopBusinessTime: this.data.shopBusinessTime,
    });
  },
});
