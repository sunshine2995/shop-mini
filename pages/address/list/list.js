import * as AddressService from '../../../services/AddressService';
import * as RouterUtil from '../../../utils/RouterUtil';

Page({
  data: {},

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

  editAddress(e) {
    const id = e.currentTarget.dataset.addressId;
    RouterUtil.go(`/pages/address/edit/address?addressId=${id}`);
  },

  deleteAddress(e) {
    const addressId = e.currentTarget.dataset.addressId;
    AddressService.removeAddress(addressId)
      .then((res) => {
        wx.showToast({
          title: res.data.data.message,
          icon: 'none',
          duration: 3000,
          success: () => {
            setTimeout(function() {
              wx.hideToast();
            }, 2000);
          },
        });
        this.data.validList.forEach((item, index) => {
          if (+item.id === addressId) {
            this.data.validList.splice(index, 1);
          }
        });
        this.data.invalidList.forEach((item, index) => {
          if (+item.id === addressId) {
            this.data.invalidList.splice(index, 1);
          }
        });
        const totalList = this.data.validList.concat(this.data.invalidList);
        this.setData({
          validList: this.data.validList,
          invalidList: this.data.invalidList,
          totalList: totalList,
        });
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
        });
      });
  },

  onLoad: function(options) {
    this.getAddressList();
  },

  onUnload() {
    RouterUtil.go('/pages/user/user');
  },
});
