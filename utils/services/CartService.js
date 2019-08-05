const wxRequest = require('../wxRequest.js');

const BaseUrl = "https://sso.caibasi.com";

export function getCartCount() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/cart/count`);
}

export function getAllCarts() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/cart/get`);
}

export function addCart(skuId) {
  return wxRequest.wxPromise("POST", `${BaseUrl}/cart`, {
    goods_sku_id: skuId,
  });
}

export function updateCart(goodsSkuId, quantity) {
  return wxRequest.wxPromise("POST", `${BaseUrl}/cart/update`, {
    goods_sku_id: goodsSkuId,
    goods_sku_num: quantity,
  });
}

export function deleteCart(goodsSkuId) {
  return wxRequest.wxPromise("POST", `${BaseUrl}/cart/delete`, {
    goods_sku_id: goodsSkuId,
  });
}

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

export function getLikeList() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/goods/guess_u_like`);
}

