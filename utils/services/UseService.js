const wxRequest = require('../wxRequest.js');

// function getCustom(busName, stopType) {
//   return wxRequest.wxPromise("POST", getBusInfoUrl, {
//     "busName": busName,
//     "stopType": stopType
//   });
// }
const BaseUrl = "https://sso.caibasi.com";

// 获取首页广告图
export function getCustom() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/custom`, );
}

// 获取用户信息
export function getUser() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/user/me`);
}

// 用户消费记录
export function getHistoryBill(page) {
  return wxRequest.wxPromise("GET", `${BaseUrl}/user/logs?page=${page}&size=11`);
}


// 获取用户信息
export function getUserInfo() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/user/info`);
}


// 获取用户当前店铺信息
export function getShopInfo(shopId) {
  return wxRequest.wxPromise("GET", `${BaseUrl}/subbranch/${shopId}`);
}

// 获取首页一级分类标题、图片
export function getSortList() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/goods/category_one`);
}

// 用户兑换券
export function codeSubmit(code) {
  return wxRequest.wxPromise("POST", `${BaseUrl}/activity/use_activation_code`,{
    code,
  });
}

// 用户留言反馈
export function addFeedback(feedback) {
  return wxRequest.wxPromise("POST", `${BaseUrl}/center/feedback`, feedback);
}

// 用户红包
export function getMyCoupons() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/user/my_coupons`);
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