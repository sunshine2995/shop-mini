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

// 获取我的赠礼
export function getMyGift() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/activity/gift`);
}

// 获取充值赠礼
export function getPrepaidGift() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/user/gift/me`);
} 


// 获取分享的任务情况
export function getShareTask() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/activity/share_recharge`);
}


// 创建分享任务
export function createTask() {
  return wxRequest.wxPromise("POST", `${BaseUrl}/activity/share_recharge`);
} 

// 领取奖励
export function receiveReward(shareId) {
  return wxRequest.wxPromise("POST", `${BaseUrl}/activity/share_recharge/leg?share_id=${shareId}`);
}


// 获取我邀请的人
export function getMyInvite() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/user/invited/me`);
}

// 获取二维码
export function getShareQrcode() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/activity/share_qrcode`);
} 

// 获取二维码
export function getWithdraw(money) {
  return wxRequest.wxPromise("POST", `${BaseUrl}/wechat/transfer`, {
    money,
  });
} 