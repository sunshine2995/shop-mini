import * as GoodsService from '../../../services/GoodsService';
import * as RouterUtil from '../../../utils/RouterUtil';

Page({
  data: {
    collectList: [],
  },

  goCollectGood() {
    RouterUtil.go('/pages/home/home');
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.goodId;
    RouterUtil.go(`/pages/goodsDetail/goodsDetail?goodId=${id}`);
  },

  getCollectList() {
    GoodsService.getCollectList()
      .then((res) => {
        wx.hideLoading();
        const collectList = res.data.data;
        this.setData({
          collectList: collectList,
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

  onShow: function() {
    wx.showLoading({
      title: '',
    });
    this.getCollectList();
  },
});
