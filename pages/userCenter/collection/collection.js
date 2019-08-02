let GoodsService = require('../../../utils/services/GoodsService.js');

Page({
  data: {

  },

  goCollectGood() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.goodId;
    wx.navigateTo({
      url: `/pages/goodsDetail/goodsDetail?goodId=${id}`,
    })
  },

  getCollectList() {
    GoodsService.getCollectList()
      .then((res) => {
        wx.hideLoading();
        var collectList = res.data.data;
        this.setData({
          collectList: collectList,
        });
      })
      .catch(() => {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      })
  },

  onReady: function() {

  },

  onShow: function () {
    wx.showLoading({
      title: '',
    })
    this.getCollectList();
  },

  onHide: function() {

  },

  onUnload: function() {

  },

  onPullDownRefresh: function() {

  },

  onReachBottom: function() {

  },

  onShareAppMessage: function() {

  }
})