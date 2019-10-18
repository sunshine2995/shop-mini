import http from './http';

// 登录
export function login(code) {
  return http.post('/wxapp/login', {
    code,
  });
}

// 保存信息
export function bindUserInfo(nickname, headImg, iv, encryptedData) {
  return http.post('/user/bind_info', {
    nickname,
    headImg,
    iv,
    enData: encryptedData,
  });
}

// 获取首页广告图
export function getCustom() {
  return http.get('/custom/all');
}

// 获取用户信息
export function getUser() {
  return http.get('/user/me');
}

// 绑定邀请人
export function inviteBind(invitedId) {
  return http.post('/wechat/bind_invite', {
    invited_id: invitedId,
  });
}

// 获取我邀请的人
export function getMyInvite() {
  return http.get('/user/invited/me');
}

// 用户消费记录
export function getHistoryBill(page) {
  return http.get(`/user/logs?page=${page}&size=11`);
}

// 用户奖金记录
export function getRewardDetail(page) {
  return http.get(`/user/invited/me/log?page=${page}&size=11`);
}

// 获取用户信息
export function getUserInfo() {
  return http.get('/user/info');
}

// 获取用户当前店铺信息
export function getShopInfo(shopId) {
  return http.get(`/subbranch/${shopId}`);
}

// 用户兑换券
export function codeSubmit(code) {
  return http.post('/activity/use_activation_code', { code });
}

// 用户留言反馈
export function addFeedback(feedback) {
  return http.post('/center/feedback', feedback);
}

// 用户红包
export function getMyCoupons() {
  return http.get('/user/my_coupons');
}

// 某金额下用户红包
export function getCouponsList(money) {
  return http.get('/order/coupons_list', { order_money: money });
}

// 运费信息
export function getshippingCharge() {
  return http.get('/subbranch/postfee');
}

// 获取验证码
export function sendBindCode(phone) {
  return http.post('/user/send_bind_code', {
    phone,
  });
}

// 绑定手机号
export function bindPhone(phone, code) {
  return http.post('/user/bind', { phone, code });
}
