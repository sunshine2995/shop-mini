const UserService = require('../../../utils/services/UseService.js');
const moment = require('../../../utils/moment.js');
Page({

  data: {
    page: 1,
    billList: [],
    total: 0,
    isLoading: false,
    isBottomMore: true,
  },

  getHistoryBill() {
    UserService.getHistoryBill(this.data.page)
      .then((res) => {
        wx.hideLoading();
        this.data.isLoading = false;
        var billList = this.data.billList.concat(res.data.data.content);
        billList.forEach((item) => {
          item.create_time = moment(item.create_time).format('YYYY/MM/DD HH:mm')
        })
        this.data.total = res.data.data.total_elements;
        this.setData({
          billList: billList,
          isLoading: this.data.isLoading,
        });
      })
      .catch(() => {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(moment().format('YYYY-MM-DD'))
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    moment.suppressDeprecationWarnings = true;
    wx.showLoading({
      title: '',
    })
    this.getHistoryBill();
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
    wx.showNavigationBarLoading();
    console.log('pull down refresh')
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.page * 11 < this.data.total) {
      wx.showLoading({
        title: '玩命加载中',
      })
      this.data.isLoading = true,
        console.log('page+1')
      this.setData({
        isLoading: this.data.isLoading,
        page: this.data.page + 1,
      })
      this.getHistoryBill();
      wx.hideLoading();
    } else {
      this.data.isBottomMore = false;
      this.setData({
        isBottomMore: this.data.isBottomMore,
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})