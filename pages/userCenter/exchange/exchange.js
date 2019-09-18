// pages/userCenter/exchange/exchange.js
const UserService = require('../../../utils/services/UseService.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    phoneNum: '', // 用户手机号
    isShowCurtain: false, // 遮罩层
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  hideCurtain() {
    this.setData({
      isShowCurtain: false,
    });
  },

  showCurtain() {
    this.setData({
      isShowCurtain: true,
    });
  },

  bindPhone() {
    this.getUser();
    this.setData({
      isShowCurtain: false,
    });
  },

  getUser() {
    UserService.getUser()
      .then((res) => {
        this.setData({
          phoneNum: res.data.data.phone,
        })
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000
        })
      });
  },

  codeSubmit() {
    if (!this.data.code) {
      wx.showToast({
        title: '请输入正确的兑换码',
        icon: 'none',
        duration: 2000,
      })
    } else if (!this.data.phoneNum) {
      this.showCurtain();
    } else {
      UserService.codeSubmit(this.data.code)
        .then((res) => {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000,
          })
        })
        .catch((res) => {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        })
    }
  },

  bindKeyInput(e) {
    this.data.code = e.detail.value.toUpperCase();
    return this.data.code;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getUser();
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