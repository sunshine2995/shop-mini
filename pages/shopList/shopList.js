import * as AddressService from '../../services/AddressService.js';
import * as RouterUtil from '../../utils/RouterUtil';

var app = getApp();

Page({
  data: {
    shopList: [], // 店铺列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  getShopListByLocation(longitude, latitude) {
    wx.showLoading({
      title: '加载中',
    });
    AddressService.getShopListByLocation(longitude, latitude)
      .then((res) => {
        res.data.data.forEach((item) => {
          wx.hideLoading();
          if (item.id === app.globalData.shopInfo.id) {
            item.showMask = false;
          } else {
            item.showMask = true;
          }
        });
        this.setData({
          shopList: res.data.data,
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

  getShopList() {
    wx.showLoading({
      title: '加载中',
    });
    AddressService.getShopList()
      .then((res) => {
        wx.hideLoading();
        res.data.data.forEach((item) => {
          item.showMask = app.globalData.shopInfo.id !== item.id;
        });
        this.setData({
          shopList: res.data.data,
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

  changeShop(e) {
    const shopId = e.currentTarget.dataset.shopId;
    this.data.shopList.forEach((item) => {
      item.showMask = +item.id !== +shopId;
    });
    this.setData({
      shopList: this.data.shopList,
    });
    AddressService.changeShop(shopId)
      .then((res) => {
        RouterUtil.go('/pages/home/home');
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000,
        });
      });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const that = this;
    let latitude, longitude;
    wx.getLocation({
      type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      success(res) {
        latitude = res.latitude;
        longitude = res.longitude;
        that.getShopListByLocation(longitude, latitude);
      },
      fail(res) {
        that.getShopList();
      },
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
});
