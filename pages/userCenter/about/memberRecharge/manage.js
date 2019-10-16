import * as RouterUtil from '../../../../utils/RouterUtil';

Page({
  goMember() {
    RouterUtil.go('/pages/userCenter/about/memberRecharge/member/member');
  },

  goCoupon() {
    RouterUtil.go('/pages/userCenter/about/memberRecharge/coupon/coupon');
  },

  goRecharge() {
    RouterUtil.go('/pages/userCenter/about/memberRecharge/recharge/recharge');
  },
});
