var UserService = require('../../utils/services/UseService.js');
Page({
  data: {

  },

  onShow: function () {
    this.getUserInfo();
    wx.showLoading({
      title: '',
    })
  },
  
  getUserInfo() {
    UserService.getUserInfo()
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