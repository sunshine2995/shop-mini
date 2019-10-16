import * as UserService from '../../../services/UserService';

Page({
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
        const userInfo = res.data.data;
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

  onShow: function() {
    wx.showLoading({
      title: '',
    });
    this.getUser();
  },
});
