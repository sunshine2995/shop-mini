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
          userInfo,
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

  onShow() {
    wx.showLoading({
      title: '',
    });
    this.getUser();
  },
});
