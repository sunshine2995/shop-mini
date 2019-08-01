var UserService = require('../../utils/services/UseService.js');
Page({
  data: {

  },
  onLoad: function(options) {
    this.getUser();
    wx.showLoading({
      title: '加载中',
    })
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
          duration: 2000
        })
      })
  }
})