import * as UserService from '../../../services/UserService';
import moment from '../../../utils/moment';

Page({
  data: {
    page: 1,
    billList: [],
    total: 0,
    isLoading: false,
    isBottomMore: true,
  },

  getHistoryBill() {
    UserService.getHistoryBill(this.data.page)
      .then((res) => {
        wx.hideLoading();
        this.data.isLoading = false;
        const billList = this.data.billList.concat(res.data.data.content);
        billList.forEach((item) => {
          item.create_time = moment(item.create_time).format('YYYY/MM/DD HH:mm');
        });
        this.data.total = res.data.data.total_elements;
        this.setData({
          billList,
          isLoading: this.data.isLoading,
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
    moment.suppressDeprecationWarnings = true;
    wx.showLoading({
      title: '',
    });
    this.getHistoryBill();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.page * 11 < this.data.total) {
      wx.showLoading({
        title: '玩命加载中',
      });
      this.data.isLoading = true;
      this.setData({
        isLoading: this.data.isLoading,
        page: this.data.page + 1,
      });
      this.getHistoryBill();
      wx.hideLoading();
    } else {
      this.data.isBottomMore = false;
      this.setData({
        isBottomMore: this.data.isBottomMore,
      });
    }
  },
});
