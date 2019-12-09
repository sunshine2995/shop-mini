import * as UserService from '../../../services/UserService';
import * as validator from '../../../utils/validator';

Page({
  data: {
    code: '',
    phoneNum: '', // 用户手机号
    isShowCurtain: false, // 遮罩层
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

  codeSubmit() {
    if (!this.data.code || this.data.code.length !== 15) {
      wx.showToast({
        title: '请输入正确的15位兑换码',
        icon: 'none',
        duration: 2000,
      });
    } else if (!this.data.phoneNum) {
      this.showCurtain();
    } else {
      UserService.codeSubmit(this.data.code)
        .then((res) => {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000,
          });
        })
        .catch((res) => {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000,
          });
        });
    }
  },

  bindKeyInput(e) {
    this.data.code = e.detail.value.replace(/\s/gi, '').toUpperCase();
    return this.data.code;
  },

  onShow() {
    this.getUser();
  },
});
