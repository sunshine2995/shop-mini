var GoodsService = require('../../utils/services/GoodsService.js');
var CartService = require('../../utils/services/CartService.js');

Page({
  data: {
    active: 0,
    spuId: 0,
    stock: 0,
    selectSkuId: 0,
  },

  toggle(e) {
    const active = e.currentTarget.dataset.index;
    this.data.selectSkuId = e.currentTarget.dataset.skuId;
    this.data.stock = e.currentTarget.dataset.stock;
    this.setData({
      active: active,
      stock: this.data.stock,
    })
  },

  getCartCount() {
    CartService.getCartCount()
      .then((res) => {
        wx.setStorageSync('cartNum', res.data.data);
        this.setData({
          cartNum: res.data.data,
        })
      });
  },

  addCart() {
    CartService.addCart(this.data.selectSkuId)
      .then((res) => {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        });
        wx.hideToast();
        this.getCartCount();
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000
        })
      });
  },

  goToDescripte() {
    wx.navigateTo({
      url: '/pages/goodsDescription/goodsDescription',
    })
  },

  getDetail() {
    GoodsService.getDetail(this.data.spuId)
      .then((res) => {
        var goodsInfo = res.data.data;
        this.data.selectSkuId = goodsInfo.goods_sku_list[0].id;
        this.data.stock = goodsInfo.goods_sku_list[0].stock;
        this.setData({
          goodsInfo: goodsInfo,
          stock: this.data.stock,
        });
        this.imgH(goodsInfo.goods_spu_details_image[0].details_img_url);
        this.getCartCount();
      })
      .catch(() => {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      })
  },

  changeStatus() {
    GoodsService.getChangeStatus(this.data.spuId)
      .then((res) => {
        this.setData({
          collectionStatus: Boolean(res.data.data.status),
        });
      })
      .catch(() => {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      })
  },

  getCollectStatus() {
    GoodsService.getCollectStatus(this.data.spuId)
      .then((res) => {
        this.getDetail();
        var collectionStatus = Boolean(res.data.data.status);
        this.setData({
          collectionStatus: collectionStatus,
        });
      })
      .catch((res) => {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      })
  },

  onLoad(option) {
    this.data.spuId = option.goodId;
    this.getCollectStatus();
  },

  //图片滑动事件
  change(e) {
    var index = e.detail.current;
    var imgUrls = this.data.goodsInfo.goods_spu_details_image;
    this.imgH(imgUrls[index].details_img_url);
  },

  //获取图片的高度，把它设置成swiper的高度
  imgH(e) {
    var that = this;
    var winWid = wx.getSystemInfoSync().windowWidth * 2;
    wx.getImageInfo({ //获取图片长宽等信息
      src: e,
      success: function(res) {
        var imgw = res.width;
        var imgh = res.height;
        var swiperH = winWid * imgh / imgw;
        that.setData({
          swiperHeight: swiperH, //设置高度
        })
      }
    })
  }
})