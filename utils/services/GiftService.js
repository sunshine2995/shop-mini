const wxRequest = require('../wxRequest.js');
const BaseUrl = "https://sso.caibasi.com";

// 用户领取鸡蛋
export function getNewUserEgg() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/activity/new_user/egg`);
} 

// 获取购物车当前结算金额下的选择赠礼页面
export function getCartGift(money) {
  return wxRequest.wxPromise("GET", `${BaseUrl}/cart/gift?money=${money}`);
}

// 根据赠礼id显示购物车赠礼
export function showCartGift(giftId) {
  return wxRequest.wxPromise("GET", `${BaseUrl}/activity/gift/${giftId}`);
}

// 获取充值页当前充值金额下的赠礼
export function getRechargeGift(rechargeId) {
  return wxRequest.wxPromise("GET", `${BaseUrl}/user/recharge/gift/${rechargeId}`);
} 