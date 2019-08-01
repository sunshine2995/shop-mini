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
  onLoad: function(options) {
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
      .catch(() => {

      })
  },
})