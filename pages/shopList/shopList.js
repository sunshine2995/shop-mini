const AddressService = require('../../services/AddressService.js');

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
        wx.switchTab({
          url: '/pages/home/home',
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const that = this;
    wx.getLocation({
      type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      success(res) {
        const latitude = res.latitude;
        const longitude = res.longitude;
        console.log(latitude, longitude);
        that.getShopListByLocation(longitude, latitude);
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
