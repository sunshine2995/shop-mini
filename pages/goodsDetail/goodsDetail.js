
var GoodsService = require('../../utils/services/GoodsService.js');

Page({
  data: {
    active: 0,
    spuId: 0,
  },

  toggle(e) {
    var active = e.currentTarget.dataset.index;
    this.setData({
      active: active,
    })
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
        this.setData({
          goodsInfo: goodsInfo,
        });
        this.imgH(goodsInfo.goods_spu_details_image[0].details_img_url);
      })
      .catch(() => {

      })
  },

  onLoad(option) {
    this.data.spuId = option.goodId;
    this.getDetail();
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
    wx.getImageInfo({//获取图片长宽等信息
      src: e,
      success: function (res) {
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