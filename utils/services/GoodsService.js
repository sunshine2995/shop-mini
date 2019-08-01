const wxRequest = require('../wxRequest.js');

const BaseUrl = "https://sso.caibasi.com";

export function getMarketingAlltype() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/marketing/alltype`);
}

export function getCategoryOneAllGoods() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/goods/category_one/goods/1/5`);
}

export function getDiscountList() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/marketing/discounts`);
}

export function getDetail(spuId) {
  return wxRequest.wxPromise("GET", `${BaseUrl}/goods/details/${spuId}`);
}