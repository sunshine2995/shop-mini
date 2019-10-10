import * as UserService from '../../services/UserService';
import * as RouterUtil from '../../utils/RouterUtil';

Page({
  data: {
    activityImgs: [],
  },

  rechargePage() {
    RouterUtil.go('/pages/recharge/recharge');
  },

  goSort() {
    RouterUtil.go('/pages/sort/sort');
  },

  goPath(event) {
    if (event.currentTarget.dataset.path) {
      const path = event.currentTarget.dataset.path;
      console.log(event, path);
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
          if (item.module_name === '广告页') {
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
});
