const GiftService = require('../../../services/GiftService.js');

const app = getApp();

Page({
  data: {
    dissatisfyList: [], // 不满足条件的赠礼列表
    satisfyList: [], // 满足条件的赠礼列表
  },

  goToCart(e) {
    wx.switchTab({
      url: '/pages/cart/cart',
    });
    app.globalData.chooseGiftId = e.currentTarget.dataset.giftId;
  },

  getCartGift(money) {
    wx.showLoading({
      title: '',
    });
    GiftService.getCartGift(money)
      .then((res) => {
        wx.hideLoading();
        this.data.satisfyList = res.data.data.satisfy_list;
        this.data.dissatisfyList = res.data.data.dissatisfy_list;
        this.setData({
          satisfyList: this.data.satisfyList,
          dissatisfyList: this.data.dissatisfyList,
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

  onLoad(option) {
    const money = +option.money;
    this.getCartGift(money);
  },
});
