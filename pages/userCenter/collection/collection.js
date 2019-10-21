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
          collectList,
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

  onShow() {
    wx.showLoading({
      title: '',
    });
    this.getCollectList();
  },
});
