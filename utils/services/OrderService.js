const wxRequest = require('../wxRequest.js');
const BaseUrl = 'https://sso.caibasi.com';

// 可用红包
export function getCouponsList(money) {
  return wxRequest.wxPromise('GET', `${BaseUrl}/order/coupons_list？order_money=${money}`);
}

// submit
export function submitOrder(model) {
  return wxRequest.wxPromise('POST', `${BaseUrl}/order/submit`, {
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
  return wxRequest.wxPromise('POST', `${BaseUrl}/order/recharge/submit`, {
    recharge_gift_id: giftId,
    payment_type: paymentType,
    total_amount: totalAmount,
    recharge_type_id: rechargeTypeId,
  });
}

// 充值类型
export function getRechargeList() {
  return wxRequest.wxPromise('GET', `${BaseUrl}/user/recharge`);
}

// 余额支付
export function balancePay(orderNo) {
  return wxRequest.wxPromise('POST', `${BaseUrl}/order/balance-pay`, {
    order_no: orderNo,
  });
}

// 微信支付
export function WxPay(orderNo) {
  return wxRequest.wxPromise('POST', `${BaseUrl}/order/mini_pay`, {
    orderNo: orderNo,
  });
}

// 订单详情
export function getOrderDetail(orderNo) {
  return wxRequest.wxPromise('GET', `${BaseUrl}/order/${orderNo}`);
}

// 不同状态下的订单数量
export function getStatusNum() {
  return wxRequest.wxPromise('GET', `${BaseUrl}/order/get_amount`);
}

// 获取全部订单信息
export function getAllOrderDetails(page) {
  return wxRequest.wxPromise('GET', `${BaseUrl}/order/all-orders?page=${page}&size=10`);
}

// 不同状态下的订单信息
export function getStatusDetails(status, page) {
  return wxRequest.wxPromise('GET', `${BaseUrl}/order/all-orders?status=${status}&page=${page}&size=10`);
}

// 删除订单
export function deleteOrder(orderNo) {
  return wxRequest.wxPromise('POST', `${BaseUrl}/order/delete/${orderNo}`);
}

// 再来一单
export function OnceMoreOrder(orderNo) {
  return wxRequest.wxPromise('POST', `${BaseUrl}/order/once_more`, {
    order_no: orderNo,
  });
}

// 评价订单
export function rateOrder(orderNo, evaluateInfo) {
  return wxRequest.wxPromise('POST', `${BaseUrl}/order/rate/${orderNo}`, evaluateInfo);
}

// 更改送达时间
export function getDeliveryEnd(orderNo, deliveryEnd) {
  return wxRequest.wxPromise('POST', `${BaseUrl}/order/bind_new_time/${orderNo}`, {
    delivery_end: deliveryEnd,
  });
}
