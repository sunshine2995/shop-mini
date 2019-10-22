import moment from '../../../libs/moment';
import * as OrderService from '../../../services/OrderService';
import * as RouterUtil from '../../../utils/RouterUtil';

Page({
  data: {
    order: {}, // order金额地址等相关信息
    giftInfo: {}, // 赠礼相关信息
    orderItems: [], // order商品信息
    totalNumber: 0, // 商品总件数
    differencePrice: 0, // 商品差价
    finallyRefundMoney: 0, // 最终退款金额
    orderNo: '', // 订单号
    ifSubmit: false, // 是否下完订单之后跳转的
  },

  freeTell() {
    wx.makePhoneCall({
      phoneNumber: this.data.order.driver_phone,
    });
  },

  getOrderDetail() {
    OrderService.getOrderDetail(this.data.orderNo)
      .then((res) => {
        this.data.order = res.data.data.order;
        if (res.data.data.order.gift) {
          this.data.giftInfo = res.data.data.order.gift;
        }

        this.data.order.delivery_end = moment(this.data.order.delivery_end).format('YYYY/MM/DD HH:mm'); // 送达时间  自取时间
        this.data.order.update_time = moment(this.data.order.update_time).format('YYYY/MM/DD HH:mm'); // 支付时间
        this.data.order.create_time = moment(this.data.order.create_time).format('YYYY/MM/DD HH:mm'); // 下单时间

        this.data.orderItems = res.data.data.items;
        this.data.orderItems.forEach((item) => {
          this.data.totalNumber += item.goods_sku_num;
        });
        this.data.differencePrice = +this.data.order.finally_amount - +this.data.order.finally_amount_before_weighing;
        this.data.finallyRefundMoney = +this.data.order.refund_money - Math.abs(+this.data.differencePrice);
        this.setData({
          order: this.data.order,
          giftInfo: this.data.giftInfo,
          orderItems: this.data.orderItems,
          totalNumber: this.data.totalNumber,
          differencePrice: this.data.differencePrice,
          finallyRefundMoney: this.data.finallyRefundMoney,
        });
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000,
        });
      });
  },

  onLoad(options) {
    this.data.orderNo = options.orderNo;
    this.data.ifSubmit = options.ifSubmit;
  },

  onShow() {
    moment.suppressDeprecationWarnings = true;
    this.getOrderDetail();
  },

  onUnload() {
    if (this.data.ifSubmit) {
      RouterUtil.go('/pages/order/list/list');
    }
  },
});
