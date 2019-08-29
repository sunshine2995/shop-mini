const wxRequest = require('../wxRequest.js');
const BaseUrl = "https://sso.caibasi.com";


// 可用红包
export function getCouponsList(money) {
  return wxRequest.wxPromise("GET", `${BaseUrl}/order/coupons_list？order_money=${money}`);
}

// submit
export function submitOrder(model) {
  return wxRequest.wxPromise("POST", `${BaseUrl}/order/submit`, {
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
  return wxRequest.wxPromise("POST", `${BaseUrl}/order/recharge/submit`, {
    recharge_gift_id: giftId,
    payment_type: paymentType,
    total_amount: totalAmount,
    recharge_type_id: rechargeTypeId,
  });
}

// 充值类型
export function getRechargeList() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/user/recharge`);
}