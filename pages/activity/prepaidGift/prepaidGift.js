import * as GiftService from '../../../services/GiftService';

Page({
  data: {
    ani: '', //动画
    rechargeGiftList: [], // 充值赠礼列表
  },

  getPrepaidGift() {
    wx.showLoading({
      title: '',
    });
    GiftService.getPrepaidGift()
      .then((res) => {
        wx.hideLoading();
        this.data.rechargeGiftList = res.data.data;
        this.setData({
          rechargeGiftList: this.data.rechargeGiftList,
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
    this.getPrepaidGift();
    this.startAnimation();
  },
});
