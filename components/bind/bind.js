import * as UserService from '../../services/UserService';

Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    phoneNum: '', // 用户手机号
    code: '', // 验证码
    isShowCurtain: false, // 遮罩层
    send: true, // 未发送前
    alreadySend: false, // 用于判断是否已发送验证码
    second: 60, // 60秒倒计时时间
    disabled: true, // 是否禁用按钮
    agreementStatus: 1, // 是否同意协议
  },

  /**
   * 组件的方法列表
   */
  methods: {
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
      var phoneNum = this.data.phoneNum;
      if (phoneNum == '' || phoneNum.replace(/\s/gi, '').length !== 11) {
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

    timer: function() {
      let promise = new Promise((resolve, reject) => {
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

    hideCurtain() {
      this.triggerEvent('hideCurtain', {
        isShowCurtain: false,
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
            this.triggerEvent('bindPhone', {
              isShowCurtain: false,
            });
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

    // onTapChild () {
    // detail对象，提供给事件监听函数
    // var myEventDetail = {
    //   id: event.currentTarget.dataset.id
    // }
    // 触发事件的选项
    // var myEventOption = {}
    // 使用 triggerEvent 方法触发自定义组件事件，指定事件名、detail对象和事件选项
    //   this.triggerEvent('bindPhone', {
    //     phoneNum: this.data.phoneNum,
    //     code: this.data.code,
    //     agreementStatus: this.data.agreementStatus,
    //   })
    // }
  },
});
