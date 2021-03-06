import http from './http';

// 获取当前购物车数量
export function getCartCount() {
  return http.get('/cart/count');
}

// 获取所有购物车列表
export function getAllCarts() {
  return http.get('/cart/get');
}

// 添加购物车
export function addCart(skuId, goodsAttr) {
  return http.post('/cart', {
    goods_sku_id: skuId,
    goods_attr: goodsAttr,
  });
}

// 更新购物车
export function updateCart(goodsSkuId, quantity) {
  return http.post('/cart/update', {
    goods_sku_id: goodsSkuId,
    goods_sku_num: quantity,
  });
}

// 删除单个商品
export function deleteCart(goodsSkuId) {
  return http.post('/cart/delete', {
    goods_sku_id: goodsSkuId,
  });
}

// 删除多个商品
export function deleteCarts(goodsSkuIds) {
  return http.delete('/cart/delete_carts', {
    goods_sku_ids: goodsSkuIds,
  });
}

// 获取猜你喜欢的列表
export function getLikeList() {
  return http.get('/goods/guess_u_like');
}

// 修改商品属性
export function editGoodsAttr(skuId, goodsAttr) {
  return http.put('/cart/goods_attr', {
    goods_sku_id: skuId,
    goods_attr: goodsAttr,
  });
}

// 获取商品属性
export function getGoodsAttr(skuId) {
  return http.get(`/goods/goods_attr?goods_sku_id=${skuId}`);
}

// 确认订单商品
export function checkout(skuIds, giftId) {
  return http.post('/cart/new/checkout', {
    goods_sku_ids: skuIds,
    gift_id: giftId,
  });
}
