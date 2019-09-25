const http = require('./http');
const BaseUrl = 'https://sso.caibasi.com';

// 用户领取鸡蛋
export function getNewUserEgg() {
  return http.get(`${BaseUrl}/activity/new_user/egg`);
}

// 获取购物车当前结算金额下的选择赠礼页面
export function getCartGift(money) {
  return http.get(`${BaseUrl}/cart/gift?money=${money}`);
}

// 根据赠礼id显示购物车赠礼
export function showCartGift(giftId) {
  return http.get(`${BaseUrl}/activity/gift/${giftId}`);
}

// 获取充值页当前充值金额下的赠礼
export function getRechargeGift(rechargeId) {
  return http.get(`${BaseUrl}/user/recharge/gift/${rechargeId}`);
}

// 获取我的赠礼
export function getMyGift() {
  return http.get(`${BaseUrl}/activity/gift`);
}

// 获取充值赠礼
export function getPrepaidGift() {
  return http.get(`${BaseUrl}/user/gift/me`);
}

// 获取分享的任务情况
export function getShareTask() {
  return http.get(`${BaseUrl}/activity/share_recharge`);
}

// 创建分享任务
export function createTask() {
  return http.post(`${BaseUrl}/activity/share_recharge`);
}

// 领取奖励
export function receiveReward(shareId) {
  return http.post(`${BaseUrl}/activity/share_recharge/leg?share_id=${shareId}`);
}

// 获取我邀请的人
export function getMyInvite() {
  return http.get(`${BaseUrl}/user/invited/me`);
}

// 获取二维码
export function getShareQrcode() {
  return http.get(`${BaseUrl}/activity/share_qrcode`);
}

// 获取二维码
export function getWithdraw(money) {
  return http.post(`${BaseUrl}/wechat/transfer`, { money });
}
