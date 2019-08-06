// pages/userCenter/customerService/customerService.js
const UserService = require('../../../utils/services/UseService.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: '',
  },

  getUser() {
    UserService.getUser()
      .then((res) => {
        this.getShopInfo(res.data.data.current_subbranch_id);
      })
      .catch(() => {
      });
  },

  getShopInfo(id) {
    UserService.getShopInfo(id)
      .then((res) => {
        const shopInfo = res.data.data;
        this.data.phoneNumber = shopInfo.shop_contract;
      })
      .catch(() => {

      });
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUser();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})