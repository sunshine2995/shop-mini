const wxRequest = require('../wxRequest.js');

const BaseUrl = "https://sso.caibasi.com";

// 获取当前购物车数量
export function getCartCount() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/cart/count`);
}
 // 获取所有购物车列表
export function getAllCarts() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/cart/get`);
}

// 添加购物车
export function addCart(skuId) {
  return wxRequest.wxPromise("POST", `${BaseUrl}/cart`, {
    goods_sku_id: skuId,
  });
}

// 更新购物车
export function updateCart(goodsSkuId, quantity) {
  return wxRequest.wxPromise("POST", `${BaseUrl}/cart/update`, {
    goods_sku_id: goodsSkuId,
    goods_sku_num: quantity,
  });
}

// 删除单个商品
export function deleteCart(goodsSkuId) {
  return wxRequest.wxPromise("POST", `${BaseUrl}/cart/delete`, {
    goods_sku_id: goodsSkuId,
  });
}

// 删除多个商品
export function deleteCarts(goodsSkuIds) {
  return wxRequest.wxPromise("DELETE", `${BaseUrl}/cart/delete_carts`, {
    goods_sku_ids: goodsSkuIds,
  });
}

export function checkout(skuIds, giftId) {
  return wxRequest.wxPromise("POST", `${BaseUrl}/cart/checkout`, {
    goods_sku_ids: skuIds,
    gift_id: giftId,
  });
}

// 获取猜你喜欢的列表
export function getLikeList() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/goods/guess_u_like`);
}

