import * as OrderService from '../../../services/OrderService';
import * as RouterUtil from '../../../utils/RouterUtil';

Page({
  data: {
    userStar: 5, // 下单体验
    driverStar: 5, // 配送服务
    goodStar: 5, // 商品质量
    noteMaxLen: 300, // 最多放多少字
    info: '', // 评价内容
    noteNowLen: 0, //备注当前字数
    orderNo: '', // 订单号
    orderList: [], // 订单商品信息
    refundList: [], // 订单退款商品信息

    tempFilePaths: [],
    imgList: [],
  },

  // 监听字数
  bindTextAreaChange: function(e) {
    const value = e.detail.value;
    const len = parseInt(value.length);
    if (len > that.data.noteMaxLen) {
      return;
    }
    that.setData({
      info: value,
      noteNowLen: len,
    });
  },

  onLoad(option) {
    this.data.tempFilePaths = [];
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

  changeGood(e) {
    const goodId = e.currentTarget.dataset.goodId;
    this.data.orderList.forEach((item) => {
      if (goodId === item.id) {
        item.evalute = 1;
      }
    });
    this.setData({
      orderList: this.data.orderList,
    });
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
    });
  },

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
      img_urls: this.data.imgList,
    };

    OrderService.rateOrder(this.data.orderNo, evaluteInfo)
      .then((res) => {
        wx.showToast({
          title: res.data.data.message,
          icon: 'success',
          duration: 1500,
          mask: false,
          success: () => {
            this.setData({
              info: '',
              noteNowLen: 0,
              userStar: 5,
              driverStar: 5,
              goodStar: 5,
            });
          },
        });
        RouterUtil.go('/pages/order/list/list?status=待评价&ifEvaluate=true');
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000,
        });
      });
  },

  /**
   * 上传图片方法
   */
  upload: function() {
    let that = this;
    wx.chooseImage({
      count: 4, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 1000,
        });
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

        that.data.tempFilePaths = that.data.tempFilePaths.concat(res.tempFilePaths);
        that.setData({
          tempFilePaths: that.data.tempFilePaths,
        });
        /**
         * 上传完成后把文件上传到服务器
         */
        let count = 0;
        this.data.imgList = [];
        for (let i = 0, h = that.data.tempFilePaths.length; i < h; i++) {
          //上传文件
          wx.uploadFile({
            url: 'https://upload.caibashi.com/uploads/',
            filePath: that.data.tempFilePaths[i],
            name: 'file',
            header: {
              'Content-Type': 'multipart/form-data',
            },
            success: function(res) {
              if (res.statusCode === 406) {
                wx.showToast({
                  title: JSON.parse(res.data).message,
                  icon: 'loading',
                  mask: true,
                  duration: 2000,
                });
              } else if (res.statusCode === 200) {
                wx.showToast({
                  title: '上传成功',
                  icon: 'loading',
                  mask: true,
                  duration: 1000,
                });
                count++;
                that.data.imgList.push(JSON.parse(res.data).url);
                //如果是最后一张,则隐藏等待中
                if (count === that.data.tempFilePaths.length) {
                  wx.hideToast();
                }
              }
            },
            fail: function(res) {
              wx.showToast({
                title: '上传失败',
                icon: 'loading',
                mask: true,
                duration: 3000,
              });
            },
          });
        }
      },
    });
  },

  /**
   * 预览图片方法
   */
  listenerButtonPreviewImage: function(e) {
    let index = e.target.dataset.index;
    wx.previewImage({
      current: this.data.tempFilePaths[index],
      urls: this.data.tempFilePaths,
      success: function(res) {},
      fail: function() {},
    });
  },

  deleteImage(e) {
    const imgList = this.data.tempFilePaths;
    const index = e.currentTarget.dataset.index;
    imgList.splice(index, 1);
    this.data.imgList.splice(index, 1);
    this.setData({
      tempFilePaths: imgList,
    });
  },
});
