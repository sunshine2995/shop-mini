import http from './http';

// 可用红包
export function getCouponsList(money) {
  return http.get(`/order/coupons_list？order_money=${money}`);
}

// 要分享的商品
export function submitGoodsShare(userId, orderNo, selectedIds) {
  return http.post('/order/share', {
    user_id: userId,
    order_no: orderNo,
    item_ids: selectedIds,
  });
}

// 分享的订单的商品详情
export function getGoodsShare(recordNo) {
  return http.get(`/order/share/${recordNo}`);
}

// submit
export function submitOrder(model) {
  return http.post('/order/submit', {
    pay_channel: 2,
    gift_id: model.giftId,
    address_id: model.addressId,
    payment_type: model.paymentType,
    goods_sku_ids: model.goodsSkuIds,
    goods_amount: model.goodsAmount,
    shipping_cost: model.shippingCost,
    total_amount: model.totalAmount,
    finally_amount: model.finallyAmount,
    delivery_end: model.deliveryEnd,
    delivery_type: model.deliveryType,
    coupon_id: model.couponId,
    buyer_message: model.buyerMessage,
    buyer_phone: model.buyerPhone,
    reduce_money: model.reduceMoney,
  });
}

// rechargeSubmit
export function submitRechargeOrder(paymentType, totalAmount, rechargeTypeId, giftId) {
  return http.post('/order/recharge/submit', {
    pay_channel: 2,
    recharge_gift_id: giftId,
    payment_type: paymentType,
    total_amount: totalAmount,
    recharge_type_id: rechargeTypeId,
  });
}

// 分享充值
export function submitRechargeShare(paymentType, totalAmount, rechargeTypeId, giftId, shareId, userId) {
  return http.post('/order/recharge/submit', {
    pay_channel: 2,
    recharge_gift_id: giftId,
    payment_type: paymentType,
    total_amount: totalAmount,
    recharge_type_id: rechargeTypeId,
    share_id: shareId,
    be_shared_user_id: userId,
  });
}

// 充值类型
export function getRechargeList() {
  return http.get('/user/recharge');
}

// 余额支付
export function balancePay(orderNo) {
  return http.post('/order/balance-pay', { order_no: orderNo });
}

// 微信支付
export function WxPay(orderNo) {
  return http.post('/order/mini_pay', { orderNo: orderNo });
}

// 订单详情
export function getOrderDetail(orderNo) {
  return http.get(`/order/${orderNo}`);
}

// 不同状态下的订单数量
export function getStatusNum() {
  return http.get('/order/get_amount');
}

// 获取全部订单信息
export function getAllOrderDetails(page) {
  return http.get(`/order/all-orders?page=${page}&size=10`);
}

// 不同状态下的订单信息
export function getStatusDetails(status, page) {
  return http.get(`/order/all-orders?status=${status}&page=${page}&size=10`);
}

// 删除订单
export function deleteOrder(orderNo) {
  return http.post(`/order/delete/${orderNo}`);
}

// 再来一单
export function OnceMoreOrder(orderNo) {
  return http.post('/order/once_more', { order_no: orderNo });
}

// 评价订单
export function rateOrder(orderNo, evaluateInfo) {
  return http.post(`/order/rate/${orderNo}`, evaluateInfo);
}

// 更改送达时间
export function getDeliveryEnd(orderNo, deliveryEnd) {
  return http.post(`/order/bind_new_time/${orderNo}`, { delivery_end: deliveryEnd });
}
