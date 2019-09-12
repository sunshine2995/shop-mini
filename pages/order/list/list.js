// pages/order/list/list.jsvar app = getApp();
var OrderService = require('../../../utils/services/OrderService.js')
const moment = require('../../../utils/moment.js');
var app = getApp();

Page({
  data: {
    winHeight: "", // 窗口高度
    currentTab: 0, // 预设当前项的值
    scrollLeft: 0, // tab标题的滚动条位置
    statusList: [{
        status: '全部',
        num: 0,
      },
      {
        status: '待付款',
        num: 0,
      },
      {
        status: '待分拣',
        num: 0,
      },
      {
        status: '分拣中',
        num: 0,
      },
      {
        status: '待配送',
        num: 0,
      },
      {
        status: '待收货',
        num: 0,
      },
      {
        status: '待评价',
        num: 0,
      },
      {
        status: '退款/售后',
        num: 0,
      },
    ], // 状态列表

    page: 1,
    orderList: [], // 订单列表
    orderNum: [], // 订单列表
    status: '全部', // 订单状态


    shopInfo: [],
    multiArray: [],
    multiIndex: [0, 0],
    deliveryEnd: '',
    durationTimes: [],
    todayTimes: [],
    showTimePicker: false, // 是否展示时间选择器
    orderNo: '', // 当前操作的订单
    isShowCurtain: false, // 遮罩层
    balance: 0, // 余额
    isEnough: false, // 是否显示余额付款
    failureOrder: {}, // 失效订单信息
    ifEvaluate: false, // 是否从评论跳转的
  },

  onUnload() {
    if (this.data.ifEvaluate) {
      wx.navigateTo({
        url: '/pages/user/user',
      })
    }
  },

  cancelPay() {
    this.data.isShowCurtain = false;
    this.setData({
      isShowCurtain: this.data.isShowCurtain,
    })
  },

  getStatusNum() {
    wx.showLoading({
      title: '加载中',
    })
    OrderService.getStatusNum()
      .then((res) => {
        wx.hideLoading();
        const statusNumList = res.data.data;
        this.data.statusList = [{
              status: '全部',
              num: 0,
            },
            {
              status: '待付款',
              num: statusNumList.wait_pay,
            },
            {
              status: '待分拣',
              num: statusNumList.wait_sorted,
            },
            {
              status: '分拣中',
              num: statusNumList.sorting,
            },
            {
              status: '待配送',
              num: statusNumList.wait_delivery,
            },
            {
              status: '待收货',
              num: statusNumList.wait_confirm,
            },
            {
              status: '待评价',
              num: statusNumList.wait_evaluate,
            },
            {
              status: '退款/售后',
              num: 0,
            },
          ],
          this.setData({
            statusList: this.data.statusList,
          });
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000
        })
      });
  },

  deleteOrder(e) {
    const orderNo = e.currentTarget.dataset.orderNo;
    wx.showLoading({
      title: '加载中',
    })
    OrderService.deleteOrder(orderNo)
      .then((res) => {
        wx.hideLoading();
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
        this.getStatusNum();
        const index = this.data.orderList.findIndex((item) => {
          return +item.order.order_no === +orderNo;
        });
        this.data.orderList.splice(index, 1);
          this.setData({
            orderList: this.data.orderList,
          });
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000
        })
      });
  },


  bindMultiPickerChange(e) {
    if (this.data.multiArray[0][0].name === '店铺已打烊') {
      wx.showToast({
        title: '店铺已打烊',
        icon: 'none'
      })
    } else {
      console.log('picker发送选择改变，携带值为', e, e.detail.value)
      this.data.multiIndex = e.detail.value;
      const date = this.data.multiArray[0][this.data.multiIndex[0]].value.replace(/\//g, '-');
      this.data.deliveryEnd = date + ' ' + this.data.multiArray[1][this.data.multiIndex[1]].value;
      this.getDeliveryEnd();
      this.setData({
        multiIndex: this.data.multiIndex,
      })
    }
  },

  bindMultiPickerColumnChange(e) {
    console.log('修改的列为', e.detail.column, e, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    if (e.detail.column == 0) { //第1列
      if (e.detail.value == 0) {
        if (this.data.todayTimes.length) {
          this.setData({
            multiArray: [this.data.multiArray[0], this.data.todayTimes]
          })
        } else {
          this.setData({
            multiArray: [this.data.multiArray[0], this.data.durationTimes]
          })
        }
      };
      if (e.detail.value == 1 || e.detail.value == 2) {
        this.setData({
          multiArray: [this.data.multiArray[0], this.data.durationTimes]
        })
        console.log(this.data.multiArray[0],this.data.multiArray[1],'this.data.multiArray')
      };
    };
  },

  getDeliveryEnd() {
    wx.showLoading({
      title: '加载中',
    })
    OrderService.getDeliveryEnd(this.data.orderNo, this.data.deliveryEnd)
      .then((res) => {
        wx.hideLoading();
        wx.showToast({
          title: res.data.data.message,
          icon: 'none',
          duration: 2000
        })
        this.data.isShowCurtain = true;
        this.setData({
          isShowCurtain: this.data.isShowCurtain,
        });
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000
        })
      });
  },

  payNotEnough() {
    wx.showToast({
      title: '余额不足',
      icon: 'none',
    })
  },

  orderFailure() {
    wx.showToast({
      title: '订单已失效',
      icon: 'none',
    })
  },

  payByBalance() {
    const _this = this;
    wx.showModal({
      title: '余额支付',
      content: '确认支付？',
      confirmColor: '#11A24A',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          _this.balancePay();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  balancePay() {
    OrderService.balancePay(this.data.orderNo)
      .then((res) => {
        wx.showToast({
          title: res.data.data.message,
          icon: 'none',
          duration: 2000
        })
        this.setData({
          isShowCurtain: false,
          // showTimePicker: false,
        });
        wx.navigateTo({
          url: `/pages/order/detail/detail?orderNo=${this.data.orderNo}&ifSubmit=true`,
        })
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000
        })
      });
  },

  WxPay() {
    OrderService.WxPay(this.data.orderNo)
      .then((res) => {
        const data = res.data.data;
        const _this = this;
        wx.requestPayment({
          'timeStamp': data.timestamp,
          'nonceStr': data.nonceStr,
          'package': data.package,
          'signType': data.signType,
          'paySign': data.paySign,
          'success': function (res) {
            _this.setData({
              isShowCurtain: false,
              // showTimePicker: false,
            });
            wx.navigateTo({
              url: `/pages/order/detail/detail?orderNo=${this.data.orderNo}`,
            })
            
          },
          'fail': function (res) {

          },
          'complete': function (res) { }
        })
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000
        })
      });
  },

  timePicker(e) {
    const orderNo = e.currentTarget.dataset.orderNo;
    this.getDeliveryTime(e);
    const _this = this;
    wx.showModal({
      title: '提示',
      content: '请点击立即付款后先重新选择时间',
      confirmColor: '#11A24A',
      confirmText: '知道啦',
      success(res) {
        if (res.confirm) {
          _this.setData({
            showTimePicker: true,
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  getDeliveryTime(e) {
    this.data.shopInfo = app.globalData.shopInfo;
    let deliveryTime = app.globalData.shopInfo.shop_delivery_time;
    let shopTime = app.globalData.shopInfo.shop_business_time;
    let chooseTime;
    let todayTime;
    let deliveryType;
    let discountAmount;
    let finallyMoney;
    const orderNo = e.currentTarget.dataset.orderNo;
    this.data.orderNo = orderNo;
    this.data.orderList.forEach((item) => {
      if (item.order.order_no === orderNo) {
        deliveryType = item.order.delivery_type;
        discountAmount = item.order.discount_amount;
        if (item.order.finally_amount_before_weighing) {
          finallyMoney = item.order.finally_amount_before_weighing;
        }
        this.data.failureOrder = item;
        this.data.isEnough = +app.globalData.userData.balance >= +finallyMoney;
      }
    })
    this.setData({
      isEnough: this.data.isEnough,
      failureOrder: this.data.failureOrder,
    });
    console.log(deliveryType, 'deliveryType',)
    if (+deliveryType === 1) {
      chooseTime = deliveryTime;
      todayTime = moment()
        .add(35, 'minutes')
        .format('YYYY/MM/DD HH:mm:ss');
      console.log(chooseTime, 'deliveryTime')
    } else {
      chooseTime = shopTime;
      todayTime = moment().format('YYYY/MM/DD HH:mm:ss');
      console.log(chooseTime, 'shopTime')
    }

    const [start, end] = chooseTime.split(' - ');
    const startTime = moment(`${moment().format('YYYY/MM/DD')} ${start}:00`)
      .add(35, 'minutes')
      .format('YYYY/MM/DD HH:mm:ss');

    const reduceMoneyTime = moment()
      .startOf('day')
      .add(22, 'hours')
      .add(10, 'minutes');

    const endTime = `${moment().format('YYYY/MM/DD')} ${end}:00`;

    const todayDiff = moment.duration(moment(endTime).valueOf() - moment(todayTime).valueOf()).as('minutes');
    const reduceMoneyDiff = moment
      .duration(moment(reduceMoneyTime).valueOf() - moment(todayTime).valueOf())
      .as('minutes');
    const diff = moment.duration(moment(endTime).valueOf() - moment(startTime).valueOf()).as('minutes');

    const todayTimes = []; // 从当前时间开始到配送时间结束时间段的数组
    const reduceMoneyTimes = []; // 有折扣商品的时间段的数组
    const durationTimes = []; // 配送时间段的数组
    this.data.todayTimes = [];
    this.data.durationTimes = [];

    const distance = 10;

    const len = parseInt(String(diff / distance), 10);
    const todayLen = parseInt(String(todayDiff / distance), 10);
    const reduceMoneyLen = parseInt(String(reduceMoneyDiff / distance), 10);

    console.log(this.data.todayTimes, 'this.data.todayTimes', todayLen, 'todayLen')
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
    console.log(discountAmount, 'discountAmount0')

    if (+discountAmount > 0) {
      if (reduceMoneyTimes.length) {
        this.data.multiArray[0] = [{
          name: '今天',
          value: moment().format('YYYY/MM/DD')
        },]
        this.data.multiArray[1] = reduceMoneyTimes;
      } else {
        this.data.multiArray[0] = [{
          name: '店铺已打烊',
          value: moment().format('YYYY/MM/DD')
        },]
        this.data.multiArray[1] = [{
          name: '明天早点来',
          value: moment().format('YYYY/MM/DD')
        },];
      }
    } else {
      if (this.data.todayTimes.length) {
        this.data.multiArray[0] = [{
          name: '今天',
          value: moment().format('YYYY/MM/DD')
        },
        {
          name: moment().add(1, 'days').format('YYYY/MM/DD'),
          value: moment().add(1, 'days').format('YYYY/MM/DD'),
        },
        {
          name: moment().add(2, 'days').format('YYYY/MM/DD'),
          value: moment().add(2, 'days').format('YYYY/MM/DD'),
        },
        ]
        this.data.multiArray[1] = this.data.todayTimes;
      } else {
        this.data.multiArray[0] = [
        {
          name: moment().add(1, 'days').format('YYYY/MM/DD'),
          value: moment().add(1, 'days').format('YYYY/MM/DD'),
        },
        {
          name: moment().add(2, 'days').format('YYYY/MM/DD'),
          value: moment().add(2, 'days').format('YYYY/MM/DD'),
        },
        ]
        this.data.multiArray[1] = this.data.durationTimes;
      }
    }
    this.setData({
      multiArray: this.data.multiArray,
      shopInfo: this.data.shopInfo,
    });

  },

  OnceMoreOrder(e) {
    const orderNo = e.currentTarget.dataset.orderNo;
    wx.showLoading({
      title: '加载中',
    })
    OrderService.OnceMoreOrder(orderNo)
      .then((res) => {
        wx.hideLoading();
        wx.showToast({
          title: res.data.data.message,
          icon: 'none',
          duration: 2000
        })
        wx.switchTab({
          url: '/pages/cart/cart',
        })
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000
        })
      });
  },

  goToEvaluate(e) {
    const orderNo = e.currentTarget.dataset.orderNo;
    wx.navigateTo({
      url: `/pages/order/evaluate/evaluate?orderNo=${orderNo}`,
    })
  },

  orderDetail(e) {
    const orderNo = e.currentTarget.dataset.orderNo;
    wx.navigateTo({
      url: `/pages/order/detail/detail?orderNo=${orderNo}`,
    })

  },

  getAllOrderDetails() {
    wx.showLoading({
      title: '加载中',
    })
    this.data.orderNum = [];
    OrderService.getAllOrderDetails(this.data.page)
      .then((res) => {
        this.data.orderNum = res.data.data.data;
        this.data.orderList = [...this.data.orderList, ...res.data.data.data];
        this.data.orderList.forEach((item) => {
          item.order.create_time = moment(item.order.create_time).format('YYYY/MM/DD HH:mm');
        })
        this.setData({
          orderList: this.data.orderList,
        });
        wx.hideLoading();
        console.log(this.data.orderList, 'ffffff');
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000
        })
      });
  },

  // # 1/待支付 2/支付中 3/已付款 4/支付失败 5/待配送 6/待发货（配送中） 7/待评价（已收货） 8/已评价 9/已退款
  getStatusDetails(status) {
    wx.showLoading({
      title: '加载中',
    })
    this.data.orderNum = [];
    OrderService.getStatusDetails(status, this.data.page)
      .then((res) => {
        wx.hideLoading();
        this.data.orderNum = res.data.data.data;
        this.data.orderList = [...this.data.orderList, ...res.data.data.data];
        this.data.orderList.forEach((item) => {
          item.order.create_time = moment(item.order.create_time).format('YYYY/MM/DD HH:mm');
        })
        this.setData({
          orderList: this.data.orderList,
        });
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000
        })
      });
  },

  // 滚动切换标签样式
  switchTab(e) {
    this.data.orderList = [];
    console.log(e, 'switchTab--')
    this.data.page = 1;
    const index = e.detail.current;
    this.data.status = this.data.statusList[index].status;
    this.setData({
      currentTab: e.detail.current,
      orderList: [],
    });
    this.checkStatus();
  },

  // 点击标题切换当前页时改变样式
  swichNav(e) {
    const index = e.target.dataset.current;
    // var cur = e.target.dataset.current;
    if (this.data.currentTab == index) {
      return false;
    } else {
      this.setData({
        currentTab: index
      })
    }
    this.data.orderList = [];
    console.log(e, 'swichNav--')
    this.data.page = 1;
    this.data.status = this.data.statusList[index].status;
    this.setData({
      currentTab: index,
      orderList: [],
    });
    this.checkStatus();
  },

  checkStatus() {
    const statusList = this.data.status;
    if (statusList === '全部') {
      this.getAllOrderDetails(this.data.page);
    } else if (statusList === '待付款') {
      this.getStatusDetails(1, this.data.page);
    } else if (statusList === '待分拣') {
      this.getStatusDetails(11, this.data.page);
    } else if (statusList === '分拣中') {
      this.getStatusDetails(12, this.data.page);
    } else if (statusList === '待配送') {
      this.getStatusDetails(3, this.data.page);
    } else if (statusList === '待收货') {
      this.getStatusDetails(6, this.data.page);
    } else if (statusList === '待评价') {
      this.getStatusDetails(7, this.data.page);
    } else if (statusList === '退款/售后') {
      this.getStatusDetails(9, this.page);
    }
    this.checkCor();
  },

  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 3) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },

  onShow() {
    moment.suppressDeprecationWarnings = true;
    this.data.balance = app.globalData.userData.balance;
    this.orderList = [];
    this.data.statusList.forEach((item, index) => {
      if (item.status === this.data.status) {
        this.data.currentTab = index;
      }
    });
    this.checkStatus();
    this.setData({
      currentTab: this.data.currentTab,
      orderList: [],
      balance: this.data.balance,
    });
    wx.showLoading({
      title: '加载中',
    })
    this.getStatusNum();
    // this.getAllOrderDetails();
  },

  onLoad(option) {
    if (option.status) {
      this.data.status = option.status;
    }
    if (option.ifEvaluate) {
      this.data.ifEvaluate = option.ifEvaluate;
    }
    // var that = this;
    //  高度自适应
    // wx.getSystemInfo({
    //   success: function(res) {
    //     var clientHeight = res.windowHeight,
    //       clientWidth = res.windowWidth,
    //       rpxR = 750 / clientWidth;
    //     var calc = clientHeight * rpxR - 180;
    //     console.log(calc)
    //     that.setData({
    //       winHeight: calc
    //     });
    //   }
    // });
  },


  lower(e) {
    if (this.data.orderNum.length === 10) {
      this.data.page = this.data.page + 1;
      this.checkStatus();
    }
    console.log('lower----')
  },

  // onShareAppMessage: function (res) {
  //   if (res.from === 'button') {
  //     // 来自页面内转发按钮
  //     console.log(res.target)
  //   }
  //   return {
  //     title: '自定义转发标题',
  //     path: '/pages/user/user'
  //   }
  // }
})