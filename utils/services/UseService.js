const wxRequest = require('../wxRequest.js');

// function getCustom(busName, stopType) {
//   return wxRequest.wxPromise("POST", getBusInfoUrl, {
//     "busName": busName,
//     "stopType": stopType
//   });
// }
const BaseUrl = "https://sso.caibasi.com";

function getCustom() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/custom`, );
}

function getUser() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/user/me`);
}

function getSortList() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/goods/category_one`);
}

// function login(code) {
//   return wxRequest.wxPromise("POST", `${BaseUrl}/wxapp/login`, {
//     code,
//   });
// }

module.exports = {
  getCustom,
  getSortList,
  getUser,
}