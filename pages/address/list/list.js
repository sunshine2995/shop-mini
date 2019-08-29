// pages/address/list/list.js
var AddressService = require('../../../utils/services/AddressService.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  getAddressList() {
    wx.showLoading({
      title: '',
    })
    AddressService.getAddressList()
      .then((res) => {
        wx.hideLoading();
        const validList = res.data.data.valid_list;
        const invalidList = res.data.data.invalid_list;
        const totalList = validList.concat(invalidList);
        this.setData({
          validList: validList,
          invalidList: invalidList,
          totalList: totalList,
        })
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
        });
        setTimeout(function() {
          wx.hideToast();
        }, 2000)
      })
  },
  
  chooseAddress(e) {
    const id = e.currentTarget.dataset.addressId;
    app.globalData.chooseAddress = id;
    wx.navigateTo({
      url: `/pages/order/submit/submit`,
    })
  },

  editAddress(e) {
    const id = e.currentTarget.dataset.addressId;
    wx.navigateTo({
      url: `/pages/address/edit/address?addressId=${id}`,
    })
  },

  deleteAddress(e) {
    console.log(e)
    const addressId = e.currentTarget.dataset.addressId;
    AddressService.removeAddress(addressId)
      .then((res) => {
        wx.showToast({
          title: res.data.data.message,
          icon: 'none',
          duration: 3000,
          success: function() {
            setTimeout(function() {
              wx.hideToast();
            }, 2000);
          }
        });
        this.data.validList.forEach((item, index) => {
          if (+item.id === addressId) {
            this.data.validList.splice(index, 1);
          }
        });
        this.data.invalidList.forEach((item, index) => {
          if (+item.id === addressId) {
            this.data.invalidList.splice(index, 1);
          }
        });
        const totalList = this.data.validList.concat(this.data.invalidList);
        this.setData({
          validList: this.data.validList,
          invalidList: this.data.invalidList,
          totalList: totalList,
        })
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
        });
      })
  },

  onLoad: function(options) {
    this.getAddressList();
  },

  onShow: function() {
    // this.getAddressList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})