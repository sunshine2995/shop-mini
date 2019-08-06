const wxRequest = require('../wxRequest.js');

// function getCustom(busName, stopType) {
//   return wxRequest.wxPromise("POST", getBusInfoUrl, {
//     "busName": busName,
//     "stopType": stopType
//   });
// }
const BaseUrl = "https://sso.caibasi.com";

export function getCustom() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/custom`, );
}

export function getUser() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/user/me`);
}

export function getHistoryBill(page) {
  return wxRequest.wxPromise("GET", `${BaseUrl}/user/logs?page=${page}&size=11`);
}

export function getUserInfo() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/user/info`);
}

export function getShopInfo(shopId) {
  return wxRequest.wxPromise("GET", `${BaseUrl}/subbranch/${shopId}`);
}


export function getSortList() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/goods/category_one`);
}

export function codeSubmit(code) {
  return wxRequest.wxPromise("POST", `${BaseUrl}/activity/use_activation_code`,{
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