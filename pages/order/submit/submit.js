import moment from '../../../libs/moment';
import * as CartService from '../../../services/CartService';
import * as AddressService from '../../../services/AddressService';
import * as OrderService from '../../../services/OrderService';
import * as UserService from '../../../services/UserService';
import * as RouterUtil from '../../../utils/RouterUtil';
import * as utils from '../../../utils/utils';

const app = getApp();

Page({
  data: {
    showWait: true,
    showTodo: false,
    info: '', // 备注
    shopInfo: [],
    multiArray: [],
    multiIndex: [0, 0],
    arriveDate: '',
    deliveryEnd: '',
    mobile: '',
    durationTimes: [],
    todayTimes: [],
    giftData: {}, // 赠品信息
    orderMessage: {}, // 订单信息
    finallyMoney: 0, // 付款金额
    finallyMoneyNoShipping: 0, // 没有运费的付款金额
    reduceMoney: 0, // 减免金额
    redMoney: 0, // 红包金额
    couponId: 0, // 红包Id
    skuIds: [], //已选中商品
    couponType: 0, // 红包类型
    couponMoney: 0, // 红包金额

    defaultAddress: '', // 默认地址
    deliveryType: 1, // 自提还是送货上门

    orderNo: '', // 订单Id
    balance: 0, // 余额
    isEnough: false, // 是否显示余额付款

    isShowCurtain: false, // 遮罩层
    isShowShopTip: false, // 自提提示
    formIds: '',
    platform: '', // 设备型号
    version: '', // 微信版本号
    payType: 1, // 支付方式
  },

  cancelPay() {
    if (this.data.orderNo) {
      RouterUtil.go(`/pages/order/detail/detail?orderNo=${this.data.orderNo}&ifSubmit=true`);
    } else {
      this.data.isShowCurtain = false;
      this.setData({
        isShowCurtain: this.data.isShowCurtain,
      });
    }
  },

  bindKeyInput(e) {
    this.data.mobile = e.detail.value;
    this.setData({
      mobile: this.data.mobile,
    });
  },

  bindMultiPickerChange(e) {
    this.data.multiIndex = e.detail.value;
    if (this.data.multiArray[0][this.data.multiIndex[0]].name === '今日') {
      wx.showToast({
        title: '今日店铺已打烊',
        icon: 'none',
      });
    } else {
      const date = this.data.multiArray[0][this.data.multiIndex[0]].value.replace(/\//g, '-');
      this.data.deliveryEnd = date + ' ' + this.data.multiArray[1][this.data.multiIndex[1]].value;
      this.data.arriveDate =
        this.data.multiArray[0][this.data.multiIndex[0]].name +
        ' ' +
        this.data.multiArray[1][this.data.multiIndex[1]].name;
      app.globalData.deliveryEnd = this.data.deliveryEnd;
      this.setData({
        multiIndex: this.data.multiIndex,
        arriveDate: this.data.arriveDate,
      });
    }
  },

  bindMultiPickerColumnChange(e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex,
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    if (e.detail.column == 0) {
      //第1列
      if (e.detail.value == 0) {
        if (this.data.todayTimes.length) {
          this.setData({
            multiArray: [this.data.multiArray[0], this.data.todayTimes],
          });
        } else {
          let todayTime = [
            {
              value: '',
              name: '配送小哥已下班',
            },
          ];
          if (this.data.multiArray[0][0].name === '今日') {
            this.setData({
              multiArray: [this.data.multiArray[0], todayTime],
            });
          } else {
            this.setData({
              multiArray: [this.data.multiArray[0], this.data.durationTimes],
            });
          }
        }
      }
      if (e.detail.value == 1 || e.detail.value == 2) {
        this.setData({
          multiArray: [this.data.multiArray[0], this.data.durationTimes],
        });
      }
    }
    // this.setData(data);
  },

  // 监听字数
  bindTextAreaChange(e) {
    const value = e.detail.value;
    const len = parseInt(value.length);
    if (len > this.data.noteMaxLen) return;
    this.setData({
      info: value,
      noteNowLen: len,
    });
  },

  getMapPosition() {
    const latitude = +this.data.shopInfo.latitude;
    const longitude = +this.data.shopInfo.longitude;
    wx.openLocation({
      latitude,
      longitude,
      scale: 18,
    });
  },

  todoShow() {
    if (!this.data.showWait) {
      this.data.showWait = true;
      this.data.showTodo = false;
      this.data.arriveDate = '';
      this.getDeliveryTime();
      this.data.multiIndex = [0, 0];
    }
    this.setData({
      arriveDate: this.data.arriveDate,
      showWait: this.data.showWait,
      showTodo: this.data.showTodo,
      multiIndex: this.data.multiIndex,
    });
  },

  fixedShow() {
    if (!this.data.showTodo) {
      this.data.showTodo = true;
      this.data.showWait = false;
      this.data.arriveDate = '';
      this.getDeliveryTime();
      this.data.multiIndex = [0, 0];
    }
    this.setData({
      arriveDate: this.data.arriveDate,
      showWait: this.data.showWait,
      showTodo: this.data.showTodo,
      multiIndex: this.data.multiIndex,
    });
  },

  chooseCoupon() {
    UserService.getCheckCoupon(this.data.skuIds)
      .then((res) => {
        if (res.data.data.flag) {
          wx.showToast({
            title: res.data.data.message,
            icon: 'none',
            duration: 3000,
          });
        } else {
          RouterUtil.go(`/pages/order/coupon/coupon?money=${this.data.orderMessage.now_amount}`);
        }
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000,
        });
      });
  },

  checkout() {
    this.data.skuIds = wx.getStorageSync('selectedIds');
    CartService.checkout(this.data.skuIds, app.globalData.chooseGiftId)
      .then((res) => {
        this.data.giftInfo = res.data.data.gift;
        this.data.orderMessage = res.data.data;
        this.data.finallyMoney = Number((this.data.orderMessage.total_now_amount - this.data.redMoney).toFixed(2));
        this.data.finallyMoneyNoShipping = Number((this.data.orderMessage.now_amount - this.data.redMoney).toFixed(2));
        this.data.reduceMoney = Number(
          (+this.data.orderMessage.goods_amount - +this.data.orderMessage.now_amount).toFixed(2),
        );
        this.getDeliveryTime();
        this.setData({
          giftData: res.data.data.gift,
          orderMessage: res.data.data,
          finallyMoney: this.data.finallyMoney,
          finallyMoneyNoShipping: this.data.finallyMoneyNoShipping,
          reduceMoney: this.data.reduceMoney,
        });
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000,
        });
        RouterUtil.go('/pages/cart/cart');
      });
  },

  getDefaultAddress() {
    AddressService.getDefaultAddress()
      .then((res) => {
        this.setData({
          defaultAddress: res.data.data,
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

  getAddress(id) {
    AddressService.getAddress(id)
      .then((res) => {
        this.setData({
          defaultAddress: res.data.data,
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

  choosePayType() {
    if (this.data.showWait) {
      this.data.isEnough = +app.globalData.userData.balance >= +this.data.finallyMoney;
      this.setData({
        isEnough: this.data.isEnough,
      });
      if (!this.data.defaultAddress.id) {
        wx.showToast({
          title: '请选择地址',
          icon: 'none',
        });
      } else if (!this.data.arriveDate) {
        wx.showToast({
          title: '请选择送达时间',
          icon: 'none',
        });
      } else if (!this.data.defaultAddress.satisfy_display) {
        wx.showToast({
          title: '请选择地址',
          icon: 'none',
        });
      } else {
        this.data.isShowCurtain = true;
        this.setData({
          isShowCurtain: this.data.isShowCurtain,
        });
      }
    } else {
      this.data.isEnough = +app.globalData.userData.balance >= +this.data.finallyMoneyNoShipping;
      this.setData({
        isEnough: this.data.isEnough,
      });
      if (!this.data.arriveDate) {
        wx.showToast({
          title: '请选择自取时间',
          icon: 'none',
        });
      } else {
        this.setData({
          isShowShopTip: true,
        });
      }
    }
  },

  shopConfirm() {
    this.setData({
      isShowShopTip: false,
      isShowCurtain: true,
    });
  },

  changeShop() {
    RouterUtil.go('/pages/shopList/shopList');
  },

  payNotEnough() {
    wx.showToast({
      title: '余额不足',
      icon: 'none',
    });
  },

  balancePay() {
    OrderService.balancePay(this.data.orderNo)
      .then((res) => {
        wx.showToast({
          title: res.data.data.message,
          icon: 'none',
          duration: 2000,
        });
        RouterUtil.go(
          `/pages/order/detail/detail?orderNo=${this.data.orderNo}&ifSubmit=true&showActivity=true&couponType=${this.data.couponType}&couponMoney=${this.data.couponMoney}`,
        );
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000,
        });
      });
  },

  WxPay() {
    OrderService.WxPay(this.data.orderNo)
      .then((res) => {
        const data = res.data.data;
        wx.requestPayment({
          timeStamp: data.timestamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: data.signType,
          paySign: data.paySign,
          success: () => {
            RouterUtil.go(
              `/pages/order/detail/detail?orderNo=${this.data.orderNo}&ifSubmit=true&showActivity=true&couponType=${this.data.couponType}&couponMoney=${this.data.couponMoney}`,
            );
          },
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

  choosePay() {
    if (this.data.payType === 1) {
      this.WxPay();
    } else if (this.data.payType === 2) {
      this.balancePay();
    }
  },

  compareVersions() {
    this.data.version = wx.getSystemInfoSync().version;
    const SDKVersion = wx.getSystemInfoSync().SDKVersion;
    wx.getSystemInfo({
      success: (res) => {
        this.data.platform = res.platform;
      },
    });
    if (
      (utils.compareVersion(this.data.version, '7.0.5') >= 0 && this.data.platform === 'ios') ||
      (utils.compareVersion(this.data.version, '7.0.6') >= 0 && this.data.platform === 'android')
    ) {
      wx.requestSubscribeMessage({
        tmplIds: [
          'F3slfbG1b31y8gC_XIzSQwu014C3WCS6u-1K6oF8uR8',
          'O_1_j5on1YvG_ndrKQy-i5CjMDx1hGDBnRjANDOF87k',
          '1_zvt7oVm_6SqHWxi4oQ2mIVtgFEHwW2htELFKb-YxQ',
        ],
        complete: () => {
          this.choosePay();
        },
      });
    } else if (utils.compareVersion(SDKVersion, '2.8.3') < 0) {
      wx.showToast({
        title: '检测到当前微信版本过低，建议升级微信版本',
        icon: 'none',
      });
      this.choosePay();
    } else {
      wx.requestSubscribeMessage({
        tmplIds: ['O_1_j5on1YvG_ndrKQy-i5CjMDx1hGDBnRjANDOF87k'],
        complete: () => {
          this.choosePay();
        },
      });
    }
  },

  pay(e) {
    this.data.payType = +e.currentTarget.dataset.payType;
    if (this.data.orderNo) {
      if (this.data.payType === 1) {
        this.compareVersions();
      } else if (this.data.payType === 2) {
        wx.showModal({
          title: '余额支付',
          content: '确认支付？',
          confirmColor: '#11A24A',
          success: (res) => {
            if (res.confirm) {
              this.compareVersions();
            }
          },
        });
      }
    } else {
      let nowMoment = '';
      if (this.data.showWait) {
        nowMoment = moment()
          .add(33, 'm')
          .format('YYYY/MM/DD HH:mm');
      } else {
        nowMoment = moment().format('YYYY/MM/DD HH:mm');
      }
      const deliveryEnd = moment(this.data.deliveryEnd).format('YYYY/MM/DD HH:mm');
      if (deliveryEnd < nowMoment) {
        this.data.arriveDate = '';
        this.data.deliveryEnd = '';
        app.globalData.deliveryEnd = this.data.deliveryEnd;
        wx.showToast({
          title: '重新选择时间',
          icon: 'none',
          duration: 2000,
        });
        this.data.isShowCurtain = false;
        this.setData({
          arriveDate: '',
          deliveryEnd: '',
          isShowCurtain: this.data.isShowCurtain,
        });
      } else {
        this.data.deliveryEnd = this.data.deliveryEnd.replace(/\//g, '-');
        if (this.data.showWait) {
          // 送菜到家
          this.data.deliveryType = 1;
        } else {
          // 到店自提
          this.data.deliveryType = 0;
        }
        let shippinCost;
        let totalAmount;
        let finallyAmount;
        if (this.data.showWait) {
          shippinCost = this.data.orderMessage.shipping_cost;
          totalAmount = this.data.orderMessage.total_amount;
          finallyAmount = this.data.finallyMoney;
        } else {
          shippinCost = 0;
          totalAmount = this.data.orderMessage.goods_amount;
          finallyAmount = this.data.finallyMoneyNoShipping;
        }
        this.data.formids = wx.getStorageSync('formids');
        if (this.data.formids) {
          wx.removeStorage({ key: 'formids' });
        }
        const model = {
          formIds: this.data.formids,
          giftId: app.globalData.chooseGiftId,
          addressId: this.data.defaultAddress.id,
          paymentType: 1,
          goodsSkuIds: this.data.skuIds,
          goodsAmount: this.data.orderMessage.goods_amount,
          shippingCost: shippinCost,
          totalAmount,
          finallyAmount: String(finallyAmount),
          deliveryEnd: this.data.deliveryEnd,
          deliveryType: this.data.deliveryType,
          couponId: this.data.couponId,
          buyerMessage: this.data.info,
          buyerPhone: this.data.mobile,
          reduceMoney: this.data.reduceMoney,
        };
        OrderService.submitOrder(model)
          .then((res) => {
            this.data.orderNo = res.data.data.orderNo;
            this.data.couponType = res.data.data.coupons.coupons_type;
            this.data.couponMoney = res.data.data.coupons.money;
            if (this.data.payType === 1) {
              this.compareVersions();
            } else if (this.data.payType === 2) {
              wx.showModal({
                title: '余额支付',
                content: '确认支付？',
                confirmColor: '#11A24A',
                success: (res) => {
                  if (res.confirm) {
                    this.compareVersions();
                  }
                },
              });
            }
            this.getCartCount();
            wx.setStorageSync('selectedIds', []);
            app.globalData.deliveryEnd = '';
            app.globalData.chooseGiftId = 0;
            app.globalData.chooseAddress = 0;
          })
          .catch((error) => {
            wx.showToast({
              title: error.data.message,
              icon: 'none',
              duration: 2000,
            });
          });
      }
    }
  },

  // 获取购物车数量
  getCartCount() {
    CartService.getCartCount().then((res) => {
      app.globalData.store.cartNum = res.data.data;
    });
  },

  getDeliveryTime() {
    this.data.shopInfo = app.globalData.shopInfo;
    let deliveryTime = app.globalData.shopInfo.shop_delivery_time;
    let shopTime = app.globalData.shopInfo.shop_business_time;
    let chooseTime = '';
    let todayTime = '';
    let start = '';
    let end = '';
    let todayDiff = '';
    let reduceMoneyDiff = '';
    if (this.data.showWait) {
      chooseTime = deliveryTime;
      todayTime = moment()
        .add(35, 'minutes')
        .format('YYYY/MM/DD HH:mm:ss');
    } else {
      chooseTime = shopTime;
      todayTime = moment()
        .add(15, 'minutes')
        .format('YYYY/MM/DD HH:mm:ss');
    }

    [start, end] = chooseTime.split(' - ');
    let startTime = '';
    if (this.data.showWait) {
      startTime = moment(`${moment().format('YYYY/MM/DD')} ${start}:00`)
        .add(35, 'minutes')
        .format('YYYY/MM/DD HH:mm:ss');
    } else {
      startTime = moment(`${moment().format('YYYY/MM/DD')} ${start}:00`)
        .add(15, 'minutes')
        .format('YYYY/MM/DD HH:mm:ss');
    }

    const reduceMoneyTime = moment()
      .startOf('day')
      .add(22, 'hours')
      .add(10, 'minutes');
    const endTime = `${moment().format('YYYY/MM/DD')} ${end}:00`;

    if (startTime > todayTime) {
      todayTime = startTime;
    }
    todayDiff = moment.duration(moment(endTime).valueOf() - moment(todayTime).valueOf()).as('minutes');
    reduceMoneyDiff = moment.duration(moment(reduceMoneyTime).valueOf() - moment(todayTime).valueOf()).as('minutes');
    const diff = moment.duration(moment(endTime).valueOf() - moment(startTime).valueOf()).as('minutes');
    this.data.todayTimes = []; // 从当前时间开始到配送时间结束时间段的数组
    const reduceMoneyTimes = []; // 有折扣商品的时间段的数组
    this.data.durationTimes = []; // 配送时间段的数组

    const distance = 10;
    let todayLen = -1;
    let reduceMoneyLen = -1;
    let len = -1;
    if (todayDiff / distance >= 0) {
      todayLen = parseInt(String(todayDiff / distance), 10); // 此处的10是10进制，转化时间戳
    }
    if (reduceMoneyDiff / distance > 0) {
      reduceMoneyLen = parseInt(String(reduceMoneyDiff / distance), 10);
    }
    if (diff / distance > 0) {
      len = parseInt(String(diff / distance), 10);
    }
    for (let i = 0; i <= len; i++) {
      const aa = (moment.duration(moment(startTime).valueOf()).as('minutes') + i * distance) * 60 * 1000;
      this.data.durationTimes.push({
        name: moment(aa).format('HH:mm'),
        value: moment(aa).format('HH:mm:ss'),
      });
    }

    for (let i = 0; i <= todayLen; i++) {
      const aa = (moment.duration(moment(todayTime).valueOf()).as('minutes') + i * distance) * 60 * 1000;
      this.data.todayTimes.push({
        name: moment(aa).format('HH:mm'),
        value: moment(aa).format('HH:mm:ss'),
      });
    }

    for (let i = 0; i <= reduceMoneyLen; i++) {
      const aa = (moment.duration(moment(todayTime).valueOf()).as('minutes') + i * distance) * 60 * 1000;
      reduceMoneyTimes.push({
        value: moment(aa).format('HH:mm:ss'),
        name: moment(aa).format('HH:mm'),
      });
    }

    if (this.data.todayTimes.length) {
      this.data.multiArray[0] = [
        {
          name: '今天',
          value: moment().format('YYYY/MM/DD'),
        },
        {
          name: '明天',
          value: moment()
            .add(1, 'days')
            .format('YYYY/MM/DD'),
        },
        {
          name: moment()
            .add(2, 'days')
            .format('YYYY/MM/DD'),
          value: moment()
            .add(2, 'days')
            .format('YYYY/MM/DD'),
        },
      ];
      this.data.multiArray[1] = this.data.todayTimes;
    } else {
      let todayTime = [
        {
          value: '',
          name: '配送小哥已下班',
        },
      ];
      this.data.multiArray[0] = [
        {
          name: '今日',
          value: '',
        },
        {
          name: '明天',
          value: moment()
            .add(1, 'days')
            .format('YYYY/MM/DD'),
        },
        {
          name: moment()
            .add(2, 'days')
            .format('YYYY/MM/DD'),
          value: moment()
            .add(2, 'days')
            .format('YYYY/MM/DD'),
        },
      ];
      if (this.data.multiArray[0][0].name === '今日') {
        this.data.multiArray[1] = todayTime;
      } else {
        this.data.multiArray[1] = this.data.durationTimes;
      }
    }
    this.setData({
      multiArray: this.data.multiArray,
      arriveDate: this.data.arriveDate,
      shopInfo: this.data.shopInfo,
      redMoney: this.data.redMoney,
    });
  },

  onLoad(options) {
    if (options.money && options.couponId) {
      this.data.redMoney = options.money;
      this.data.couponId = options.couponId;
    }
  },

  onShow() {
    this.data.balance = app.globalData.userData.balance;
    moment.suppressDeprecationWarnings = true;
    this.data.mobile = app.globalData.userData.phone;
    this.data.skuIds = wx.getStorageSync('selectedIds');
    this.checkout();
    this.getDeliveryTime();
    if (app.globalData.deliveryEnd) {
      if (moment(app.globalData.deliveryEnd).format('YYYY/MM/DD') === moment().format('YYYY/MM/DD')) {
        this.data.arriveDate = `今天 ${moment(app.globalData.deliveryEnd).format('HH:mm')}`;
      } else {
        this.data.arriveDate = moment(app.globalData.deliveryEnd).format('YYYY/MM/DD HH:mm');
      }
      this.data.deliveryEnd = app.globalData.deliveryEnd;
    }
    this.setData({
      arriveDate: this.data.arriveDate,
      mobile: this.data.mobile,
      balance: this.data.balance,
    });
    if (app.globalData.chooseAddress !== 0) {
      this.getAddress(app.globalData.chooseAddress);
    } else {
      this.getDefaultAddress();
    }
  },
});
