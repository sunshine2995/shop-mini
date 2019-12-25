import * as RouterUtil from '../../../utils/RouterUtil';
const app = getApp();

Page({
  data: {
    phoneNumber: '',
  },

  Login() {
    RouterUtil.go('/pages/login/login');
  },

  onShow() {
    this.data.phoneNumber = app.globalData.shopInfo.shop_contract;
    this.setData({
      phoneNumber: this.data.phoneNumber,
    });
  },
});
