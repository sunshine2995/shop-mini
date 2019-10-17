import * as UserService from '../../../services/UserService';
import * as GiftService from '../../../services/GiftService';

Page({
  data: {
    userInfo: {},
    ani: '', //动画
    showImage: true,
    showButton: false,
    typeOptions: [
      {
        value: 1,
        text: 10,
      },
      {
        value: 2,
        text: 30,
      },
      {
        value: 3,
        text: 50,
      },
    ],
    noney: 0, // 提现金额
    active: 4, // 选中项
  },

  showTip() {
    wx.showToast({
      title: '当前奖金不足提现此金额',
      icon: 'none',
    });
  },

  getWithdraw() {
    if (this.data.money) {
      GiftService.getWithdraw(this.data.money)
        .then((res) => {
          wx.showToast({
            title: '提现成功',
            icon: 'none',
          });
          wx.navigateBack();
        })
        .catch(() => {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000,
          });
        });
    } else {
      wx.showToast({
        title: '未选择提现金额',
        icon: 'none',
      });
    }
  },

  toggle(e) {
    const active = e.currentTarget.dataset.index;
    this.data.typeOptions.forEach((item) => {
      if (+item.value === +e.currentTarget.dataset.value) {
        this.data.money = item.text;
      }
    });
    this.data.showButton = Number(this.data.money) <= Number(this.data.userInfo.withdrawal);
    this.setData({
      active: active,
      showButton: this.data.showButton,
    });
  },

  showImg() {
    this.setData({
      showImage: true,
    });
  },

  showText() {
    this.setData({
      showImage: false,
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

  onShow: function() {
    this.getUser();
    this.startAnimation();
  },

  onShareAppMessage: function(res) {
    const invitedId = this.data.userInfo.id;
    if (res.from === 'button') {
      console.log(res.target, 'share');
    }
    return {
      title: '分享三人次好友充值即可免费领取羊腿～',
      path: `/pages/home/home?invite_id=${invitedId}`,
    };
  },
});
