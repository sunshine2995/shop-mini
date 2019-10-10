import * as AddressService from '../../../services/AddressService';
import * as RouterUtil from '../../../utils/RouterUtil';

var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {},

  addAddress() {
    RouterUtil.go('/pages/address/add/address');
  },

  getAddressList() {
    wx.showLoading({
      title: '',
    });
    AddressService.getAddressList()
      .then((res) => {
        wx.hideLoading();
        const validList = res.data.data.valid_list;
        const invalidList = res.data.data.invalid_list;
        const totalList = validList.concat(invalidList);
        this.setData({
          validList: validList,
          invalidList: invalidList,
          totalList: totalList,
        });
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
        });
        setTimeout(function() {
          wx.hideToast();
        }, 2000);
      });
  },

  chooseAddress(e) {
    const id = e.currentTarget.dataset.addressId;
    app.globalData.chooseAddress = id;
    RouterUtil.go(`/pages/order/submit/submit`);
  },

  overTip() {
    wx.showToast({
      title: '该地址已超出配送范围',
      icon: 'none',
    });
  },

  onShow: function() {
    this.getAddressList();
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
