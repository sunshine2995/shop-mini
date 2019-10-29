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
  getImageInfo() {
    wx.getImageInfo({
      src: this.data.qrImage,
      success: (res) => {
        var path = res.path;
        //保存图片到本地
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success: () => {
            wx.showToast({
              title: '保存成功',
            });
          },
          fail: () => {
            wx.showModal({
              title: '',
              content: '检测到您未打开保存图片权限，是否前往开启',
              confirmText: '前往开启',
              cancelText: '暂不开启',
              confirmColor: '#11A24A',
              success: (res) => {
                if (res.confirm) {
                  wx.openSetting({
                    //打开设置页
                    success(res) {
                      //成功，返回页面回调
                      //如果同意了位置授权则userLocation=true
                      if (res.authSetting['scope.writePhotosAlbum']) {
                        // 业务逻辑
                      }
                    },
                  });
                } else if (res.cancel) {
                  // 未开启
                }
              },
            });
          },
        });
      },
    });
  },

  getUser() {
    wx.showLoading({
      title: '加载中',
    });
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

  getMyInvite() {
    wx.showLoading({
      title: '加载中',
    });
    UserService.getMyInvite()
      .then((res) => {
        wx.hideLoading();
        if (res.data.data.length) {
          this.data.inviteList = res.data.data;
          this.setData({
            inviteList: this.data.inviteList,
          });
        }
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
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
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000,
        });
      });
  },

  startAnimation() {
    const animation = wx.createAnimation({
      duration: 2000,
      timingFunction: 'ease',
      delay: 0,
    });
    let next = false;
    setInterval(() => {
      if (next) {
        animation.rotate(30).step();
        next = !next;
      } else {
        animation.rotate(-30).step();
        next = !next;
      }
      this.setData({
        ani: animation.export(),
      });
    }, 150);
  },

  onShow() {
    this.getUser();
    this.getMyInvite();
    this.startAnimation();
  },
});
