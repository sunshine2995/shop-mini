import * as UserService from '../../services/UserService';
import * as RouterUtil from '../../utils/RouterUtil';

Page({
  data: {
    activityImgs: [],
  },
  goPath(event) {
    let path;
    if (event.currentTarget.dataset.path) {
      path = event.currentTarget.dataset.path;
      RouterUtil.go(path);
    }
  },

  getCustom() {
    wx.showLoading({
      title: '加载中',
    });
    UserService.getCustom()
      .then((res) => {
        wx.hideLoading();
        const imgData = res.data.data;
        imgData.forEach((item) => {
          if (item.module_name === '商品详情页') {
            this.data.activityImgs.push({
              img_url: item.img_url,
              mini_turn_url: item.mini_turn_url,
            });
          }
        });
        this.setData({
          activityImgs: this.data.activityImgs,
        });
      })
      .catch((res) => {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000,
        });
      });
  },

  onShow: function() {
    this.getCustom();
  },
});
