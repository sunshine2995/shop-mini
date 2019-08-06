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

export function getCollectStatus(spuId) {
  return wxRequest.wxPromise("GET", `${BaseUrl}/user/check/collections/?goods_spu_id=${spuId}`);
}

export function getChangeStatus(spuId) {
  return wxRequest.wxPromise("GET", `${BaseUrl}/user/collect?goods_spu_id=${spuId}`);
}

export function getCollectList(spuId) {
  return wxRequest.wxPromise("GET", `${BaseUrl}/user/collections`);
}

export function fuzzySearchGoodsIdName(searchVal) {
  return wxRequest.wxPromise("GET", `${BaseUrl}/goods/fuzzy_search?q=${searchVal}`);
}

export function fuzzySearchGoodsSpu(searchVal) {
  return wxRequest.wxPromise("GET", `${BaseUrl}/goods/fuzzy_search/goods_spu?q=${searchVal}`);
} 

// 热门搜索
export function getHotSearch() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/goods/hot_search/10`);
} 

// 搜索处推荐
export function getRecommended() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/goods/recommended`);
}
