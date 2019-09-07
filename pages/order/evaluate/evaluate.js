var OrderService = require('../../../utils/services/OrderService.js')

Page({
  data: {
    userStar: 5, // 下单体验
    driverStar: 5, // 配送服务
    goodStar: 5, // 商品质量
    noteMaxLen: 300, // 最多放多少字
    info: "", // 评价内容
    noteNowLen: 0, //备注当前字数
    orderNo: '', // 订单号
    orderList: [], // 订单商品信息
    refundList: [], // 订单退款商品信息
  },
  // 监听字数
  bindTextAreaChange: function(e) {
    var that = this
    var value = e.detail.value,
      len = parseInt(value.length);
    if (len > that.data.noteMaxLen)
      return;
    that.setData({
      info: value,
      noteNowLen: len
    })
  },

  onLoad(option) {
    this.data.orderNo = option.orderNo;
    this.getOrderDetail();
  },

  changeUserStar(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      userStar: index,
    });
  },

  changeDriverStar(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      driverStar: index,
    });
  },

  changeGoodStar(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      goodStar: index,
    });
  },

  getOrderDetail() {
    OrderService.getOrderDetail(this.data.orderNo)
      .then((res) => {
        res.data.data.items.forEach((item) => {
          if (!item.is_refund) {
            this.data.orderList.push(item);
          } else {
            this.data.refundList.push(item);
          }
        });
        this.setData({
          orderList: this.data.orderList,
          refundList: this.data.refundList,
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

  changeGood(e) {
    const goodId = e.currentTarget.dataset.goodId;
    this.data.orderList.forEach((item) => {
      if (goodId === item.id) {
        item.evalute = 1;
      }
    });
    this.setData({
      orderList: this.data.orderList,
    })
  },

  changeBad(e) {
    const goodId = e.currentTarget.dataset.goodId;
    this.data.orderList.forEach((item) => {
      if (goodId === item.id) {
        item.evalute = 0;
      }
    });
    this.setData({
      orderList: this.data.orderList,
    })
  },


  // 提交清空当前值
  bindSubmit() {
    const goodsValue = [];
    this.data.orderList.forEach((item) => {
      goodsValue.push({ id: item.id, value: item.evalute });
    });
    const evaluteInfo = {
      star: this.data.userStar,
      driver_star: this.data.driverStar,
      good_star: this.data.goodStar,
      content: this.data.info,
      items: goodsValue,
    };

    OrderService.rateOrder(this.data.orderNo, evaluteInfo)
      .then((res) => {
        var that = this;
        wx.showToast({
          title: res.data.data.message,
          icon: 'success',
          duration: 1500,
          mask: false,
          success: function () {
            that.setData({
              info: '',
              noteNowLen: 0,
              userStar: 5,
              driverStar: 5,
              goodStar: 5,
            })
          }
        });
        wx.navigateTo({
          url: "/pages/order/list/list?status=待评价&ifEvaluate=true",
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

})