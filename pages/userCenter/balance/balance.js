const UserService = require('../../../utils/services/UserService.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShowCurtain: false,
  },

  hideCurtain() {
    this.data.isShowCurtain = false;
    this.setData({
      isShowCurtain: this.data.isShowCurtain,
    });
  },

  showCurtain() {
    this.data.isShowCurtain = true;
    this.setData({
      isShowCurtain: this.data.isShowCurtain,
    });
  },

  getUser() {
    UserService.getUser()
      .then((res) => {
        wx.hideLoading();
        var userInfo = res.data.data;
        this.setData({
          userInfo: userInfo,
        });
      })
      .catch(() => {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000,
        });
      });
  },

  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.showLoading({
      title: '',
    });
    this.getUser();
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
