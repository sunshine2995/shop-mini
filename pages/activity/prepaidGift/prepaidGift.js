// pages/activity/prepaidGift/prepaidGift.js
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
    this.getPrepaidGift();
    this.startAnimation();
  },
});
