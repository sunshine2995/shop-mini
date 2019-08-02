var GoodsService = require('../../utils/services/GoodsService.js');

Page({
  data: {

  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.goodId;
    wx.navigateTo({
      url: `/pages/goodsDetail/goodsDetail?goodId=${id}`,
    })
  },

  onShow: function(options) {
    wx.showLoading({
      title: '',
    })
    this.getDiscountList();
  },

  getDiscountList() {
    GoodsService.getDiscountList()
      .then((res) => {
        wx.hideLoading();
        var discountList = res.data.data;
        this.setData({
          discountList: discountList,
        });
      })
      .catch((res) => {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      })
  },
})