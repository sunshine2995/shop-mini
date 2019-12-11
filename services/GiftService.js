import http from './http';

// 用户领取鸡蛋
export function getNewUserEgg() {
  return http.get('/activity/new_user/egg');
}

// 获取购物车当前结算金额下的选择赠礼页面
export function getCartGift(money) {
  return http.get(`/cart/gift?money=${money}`);
}

// 根据赠礼id显示购物车赠礼
export function showCartGift(giftId) {
  return http.get(`/activity/gift/${giftId}`);
}

// 获取充值页当前充值金额下的赠礼
export function getRechargeGift(rechargeId) {
  return http.get(`/user/recharge/gift/${rechargeId}`);
}

// 获取我的赠礼
export function getMyGift() {
  return http.get('/activity/gift');
}

// 获取充值赠礼
export function getPrepaidGift() {
  return http.get('/user/gift/me');
}

// 获取分享的任务情况
export function getShareTask() {
  return http.get('/activity/share_recharge');
}

// 创建分享任务
export function createTask() {
  return http.post('/activity/share_recharge');
}

// 领取奖励
export function receiveReward(shareId) {
  return http.get(`/activity/share_recharge/leg?share_id=${shareId}`);
}

// 获取我邀请的人
export function getMyInvite() {
  return http.get('/user/invited/me');
}

// 获取二维码
export function getShareQrcode() {
  return http.post('/user/qr_code');
}

// 提现
export function getWithdraw(money, type) {
  return http.post('/wechat/mini_transfer', { money, type });
}
