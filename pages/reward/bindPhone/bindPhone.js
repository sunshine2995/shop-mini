import * as UserService from '../../../services/UserService';
import * as validator from '../../../utils/validator';
import * as RouterUtil from '../../../utils/RouterUtil';

Page({
  data: {
    phoneNum: '', // 用户手机号
    code: '', // 验证码
    send: true, // 未发送前
    alreadySend: false, // 用于判断是否已发送验证码
    second: 60, // 60秒倒计时时间
    disabled: true, // 是否禁用按钮
    agreementStatus: 1, // 是否同意协议
  },

  checkboxChange(e) {
    this.data.agreementStatus = Number(e.detail.value);
  },

  mobileInput(e) {
    this.data.phoneNum = e.detail.value;
  },

  codeInput(e) {
    this.data.code = e.detail.value;
  },

  sendMsg() {
    const phoneNum = this.data.phoneNum;
    if (!validator.isPhoneNumber(phoneNum)) {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none',
        duration: 2000,
      });
      return false;
    } else {
      UserService.sendBindCode(phoneNum)
        .then((res) => {
          wx.showToast({
            title: res.data.data.message,
            icon: 'none',
            duration: 2000,
          });
          this.setData({
            alreadySend: true,
            send: false,
          });
          this.timer();
        })
        .catch((error) => {
          wx.showToast({
            title: error.data.message,
            icon: 'none',
            duration: 2000,
          });
        });
    }
  },

  timer() {
    const promise = new Promise((resolve) => {
      let setTimer = setInterval(() => {
        this.setData({
          second: this.data.second - 1,
        });
        if (this.data.second <= 0) {
          this.setData({
            second: 60,
            alreadySend: false,
            send: true,
          });
          resolve(setTimer);
        }
      }, 1000);
    });
    promise.then((setTimer) => {
      clearInterval(setTimer);
    });
  },

  onTapChild() {
    if (this.data.agreementStatus === 0) {
      wx.showToast({
        title: '未同意协议',
        icon: 'none',
        duration: 2000,
      });
    } else {
      UserService.bindPhone(this.data.phoneNum, this.data.code)
        .then((res) => {
          wx.showToast({
            title: res.data.data.message,
            icon: 'none',
            duration: 2000,
          });
          RouterUtil.back();
        })
        .catch((error) => {
          wx.showToast({
            title: error.data.message,
            icon: 'none',
            duration: 2000,
          });
        });
    }
  },
});
