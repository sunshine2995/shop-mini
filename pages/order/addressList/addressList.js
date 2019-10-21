import * as AddressService from '../../../services/AddressService';
import * as RouterUtil from '../../../utils/RouterUtil';

const app = getApp();

Page({
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
          validList,
          invalidList,
          totalList,
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

  onShow() {
    this.getAddressList();
  },
});
