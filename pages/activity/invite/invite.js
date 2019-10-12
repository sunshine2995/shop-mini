// pages/activity/invite/invite.js
import * as UserService from '../../../services/UserService';
import * as GiftService from '../../../services/GiftService';

Page({
  data: {
    userInfo: {},
    inviteList: [],
    ani: '', //动画
    showQrImage: false, // 是否展示二维码
    qrImage: '', // 分享二维码的图片
  },

  hideQrImage() {
    this.setData({
      showQrImage: false,
    });
  },

  getUser() {
    wx.showLoading({
      title: '加载中',
    });
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

  getMyInvite() {
    wx.showLoading({
      title: '加载中',
    });
    UserService.getMyInvite()
      .then((res) => {
        wx.hideLoading();
        this.data.inviteList = res.data.data;
        this.setData({
          inviteList: inviteList,
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

  getShareQrcode() {
    this.data.showQrImage = true;
    wx.showLoading({
      title: '加载中',
    });
    this.setData({
      showQrImage: this.data.showQrImage,
    });
    GiftService.getShareQrcode()
      .then((res) => {
        wx.hideLoading();
        this.data.qrImage = res.data.data.url;
        this.setData({
          qrImage: this.data.qrImage,
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

  startAnimation() {
    var animation = wx.createAnimation({
      duration: 2000,
      timingFunction: 'ease',
      delay: 0,
    });
    var next = false;
    setInterval(() => {
      if (next) {
        //根据需求实现相应的动画
        // animation.opacity(0.2).step();
        animation.rotate(30).step();
        next = !next;
      } else {
        // animation.opacity(1).step();
        animation.rotate(-30).step();
        next = !next;
      }
      this.setData({
        //导出动画到指定控件animation属性
        ani: animation.export(),
      });
    }, 150);
  },

  onShow() {
    this.getUser();
    this.startAnimation();
  },
});
