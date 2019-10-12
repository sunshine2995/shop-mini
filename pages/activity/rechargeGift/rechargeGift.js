// pages/activity/rechargeGift/rechargeGift.js
Page({
  data: {
    ani: '',
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
    this.startAnimation();
  },
});
