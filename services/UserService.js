const wxRequest = require('../utils/wxRequest.js');

const BaseUrl = 'https://sso.caibasi.com';

// 获取首页广告图
export function getCustom() {
  return wxRequest.wxPromise('GET', `${BaseUrl}/custom/all`);
}

// 获取用户信息
export function getUser() {
  return wxRequest.wxPromise('GET', `${BaseUrl}/user/me`);
}

// 用户消费记录
export function getHistoryBill(page) {
  return wxRequest.wxPromise('GET', `${BaseUrl}/user/logs?page=${page}&size=11`);
}

// 获取用户信息
export function getUserInfo() {
  return wxRequest.wxPromise('GET', `${BaseUrl}/user/info`);
}

// 获取用户当前店铺信息
export function getShopInfo(shopId) {
  return wxRequest.wxPromise('GET', `${BaseUrl}/subbranch/${shopId}`);
}

// 用户兑换券
export function codeSubmit(code) {
  return wxRequest.wxPromise('POST', `${BaseUrl}/activity/use_activation_code`, {
    code,
  });
}

// 用户留言反馈
export function addFeedback(feedback) {
  return wxRequest.wxPromise('POST', `${BaseUrl}/center/feedback`, feedback);
}

// 用户红包
export function getMyCoupons() {
  return wxRequest.wxPromise('GET', `${BaseUrl}/user/my_coupons`);
}

// 某金额下用户红包
export function getCouponsList(money) {
  return wxRequest.wxPromise('GET', `${BaseUrl}/order/coupons_list`, {
    order_money: money,
  });
}

// 运费信息
export function getshippingCharge() {
  return wxRequest.wxPromise('GET', `${BaseUrl}/subbranch/postfee`);
}

// 获取验证码
export function sendBindCode(phone) {
  return wxRequest.wxPromise('POST', `${BaseUrl}/user/send_bind_code`, {
    phone,
  });
}

// 绑定手机号
export function bindPhone(phone, code) {
  return wxRequest.wxPromise('POST', `${BaseUrl}/user/bind`, {
    phone,
    code,
  });
}

// function login(code) {
//   return wxRequest.wxPromise("POST", `${BaseUrl}/wxapp/login`, {
//     code,
//   });
// }

// module.exports = {
//   getCustom,
//   getSortList,
//   getUser,
// }
