import * as UserService from '../../services/UserService';
import * as GiftService from '../../services/GiftService';
import * as RouterUtil from '../../utils/RouterUtil';

Page({
  data: {
    money: 0,
    ifCash: false,
    userPhone: '',
  },

  getUser() {
    UserService.getUser()
      .then((res) => {
        this.data.money = +res.data.data.reward_money;
        this.data.ifCash = res.data.data.rewarded;
        this.data.userPhone = res.data.data.phone;
        this.setData({
          money: this.data.money,
          ifCash: this.data.ifCash,
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

  getWithdraw() {
    if (!this.data.userPhone) {
      RouterUtil.go('/pages/reward/bindPhone/bindPhone');
    } else {
      GiftService.getWithdraw(this.data.money, 2)
        .then(() => {
          wx.showToast({
            title: '提现成功',
            icon: 'none',
          });
          this.getUser();
        })
        .catch((error) => {
          wx.showToast({
            title: error.data.message,
            icon: 'none',
            duration: 2000,
          });
        });
    }
  },

  onShow() {
    this.getUser();
  },
});
