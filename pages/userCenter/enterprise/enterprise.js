// pages/userCenter/enterprise/enterprise.js
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
        this.data.phoneNumber = shopInfo.shop_contact_phone;
        this.setData({
          phoneNumber: this.data.phoneNumber,
        });
      })
      .catch(() => {
        
      });
  },

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