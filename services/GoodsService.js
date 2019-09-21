const http = require('./http');
const BaseUrl = 'https://sso.caibasi.com';

export function getMarketingAlltype() {
  return http.get(`${BaseUrl}/marketing/alltype`);
}

export function getCategoryOneAllGoods() {
  return http.get(`${BaseUrl}/goods/category_one/goods/1/5`);
}

export function getDiscountList() {
  return http.get(`${BaseUrl}/marketing/discounts`);
}

export function getDetail(spuId) {
  return http.get(`${BaseUrl}/goods/details/${spuId}`);
}

export function getCollectStatus(spuId) {
  return http.get(`${BaseUrl}/user/check/collections/?goods_spu_id=${spuId}`);
}

export function getChangeStatus(spuId) {
  return http.get(`${BaseUrl}/user/collect?goods_spu_id=${spuId}`);
}

export function getCollectList(spuId) {
  return http.get(`${BaseUrl}/user/collections`);
}

export function fuzzySearchGoodsIdName(searchVal) {
  return http.get(`${BaseUrl}/goods/fuzzy_search?q=${searchVal}`);
}

export function fuzzySearchGoodsSpu(searchVal) {
  return http.get(`${BaseUrl}/goods/fuzzy_search/goods_spu?q=${searchVal}`);
}

// 热门搜索
export function getHotSearch() {
  return http.get(`${BaseUrl}/goods/hot_search/10`);
}

// 搜索处推荐
export function getRecommended() {
  return http.get(`${BaseUrl}/goods/recommended`);
}

// 一级分类标题
export function getOneCategory() {
  return http.get(`${BaseUrl}/goods/category_one`);
}

// 某一级分类下的二级分类
export function getAllGoods(OneId) {
  return http.get(`${BaseUrl}/goods/category_one/new/goods?category_one_id=${OneId}`);
}

// 获取新手特价商品
export function getNewUserGoods() {
  return http.get(`${BaseUrl}/activity/new_user/goods`);
}
