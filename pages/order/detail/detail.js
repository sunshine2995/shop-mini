import moment from '../../../libs/moment';
import * as OrderService from '../../../services/OrderService';
import * as UserService from '../../../services/UserService';
import * as RouterUtil from '../../../utils/RouterUtil';

Page({
  data: {
    order: {}, // order金额地址等相关信息
    giftInfo: {}, // 赠礼相关信息
    orderItems: [], // order商品信息
    totalNumber: 0, // 商品总件数
    orderNo: '', // 订单号
    isShowCurtain: false, // 遮罩层
    couponMoney: 0, // 红包金额
    ifSubmit: false, // 是否下完订单之后跳转的
    ifShowActivity: false, // 是否显示活动图片
    selectedIds: [], // 被选中的要分享的商品id
    showChecked: false, // 是否显示选择框
    userId: 0, // 用户id
    recordNo: '', // 用户分享的唯一标识
    showShare: false, // 是否确定分享
  },

  goToActivity() {
    RouterUtil.go('/pages/activity/invite/invite');
  },

  freeTell() {
    wx.makePhoneCall({
      phoneNumber: this.data.order.driver_phone,
    });
  },

  hide() {
    this.setData({
      isShowCurtain: false,
    });
  },

  getChecked() {
    wx.showToast({
      title: '请选择要分享的商品',
      icon: 'none',
      duration: 2000,
    });
    this.setData({
      showChecked: true,
    });
  },

  itemSelected(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.orderItems[index];
    item.check = !item.check;
    // prettier-ignore
    this.data.selectedIds = this.data.orderItems
                              .filter((item) => item.check)
                              .map((item) => item.id);
    this.setData({
      orderItems: this.data.orderItems,
      selectedIds: this.data.selectedIds,
    });
  },

  getUser() {
    UserService.getUser()
      .then((res) => {
        this.data.userId = res.data.data.id;
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000,
        });
      });
  },

  submitGoodsShare() {
    OrderService.submitGoodsShare(this.data.userId, this.data.orderNo, this.data.selectedIds)
      .then((res) => {
        this.data.recordNo = res.data.data.record_no;
        this.setData({
          showShare: true,
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
          item.check = false;
        });
        this.setData({
          order: this.data.order,
          giftInfo: this.data.giftInfo,
          orderItems: this.data.orderItems,
          totalNumber: this.data.totalNumber,
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

  getNewYearGift() {
    this.hide();
    const couponName = `新年${this.data.couponMoney}元红包`;
    UserService.getNewYearGift(couponName, 0)
      .then((res) => {
        wx.showToast({
          title: res.data.data.message,
          icon: 'none',
          duration: 2000,
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
    if (options.ifSubmit) {
      this.data.ifSubmit = options.ifSubmit;
    }
    if (options.showActivity) {
      this.data.ifShowActivity = options.showActivity;
      this.setData({
        ifShowActivity: this.data.ifShowActivity,
      });
    }
    if (options.couponType && +options.couponType === 4) {
      this.data.isShowCurtain = true;
      this.setData({
        isShowCurtain: true,
      });
    }
    if (options.couponMoney) {
      this.data.couponMoney = +options.couponMoney;
      this.setData({
        couponMoney: this.data.couponMoney,
      });
    }
  },

  onShow() {
    moment.suppressDeprecationWarnings = true;
    this.getOrderDetail();
    this.getUser();
  },

  onUnload() {
    if (this.data.ifSubmit) {
      RouterUtil.go('/pages/order/list/list');
    }
  },
  onShareAppMessage() {
    return {
      title: '热卖商品，送货到家~',
      path: `/pages/order/shareDetail/shareDetail?recordNo=${this.data.recordNo}`,
    };
  },
});
