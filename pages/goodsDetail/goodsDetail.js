import * as GoodsService from '../../services/GoodsService';
import * as CartService from '../../services/CartService';
import * as UserService from '../../services/UserService';
import * as RouterUtil from '../../utils/RouterUtil';

Page({
  data: {
    active: 0,
    spuId: 0,
    stock: 0,
    // 属性相关
    selectSkuId: 0,
    carts: [], // 购物车信息
    cartIds: [], // 购物车商品id
    goodsAttrs: [], // 商品属性列表
    goodsAttr: '', // 商品属性
    subbranchArea: '', // 配送地址
    shipping: 0, // 免配送费条件
  },

  getUser() {
    UserService.getUser()
      .then((res) => {
        const shopId = res.data.data.current_subbranch_id;
        this.getShopInfo(shopId);
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000,
        });
      });
  },

  getShopInfo(shopId) {
    UserService.getShopInfo(shopId)
      .then((res) => {
        this.setData({
          subbranchArea: res.data.data.subbranch_area,
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

  getshippingCharge() {
    UserService.getshippingCharge()
      .then((res) => {
        this.setData({
          shipping: +res.data.data.start_price,
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

  toggle(e) {
    const active = e.currentTarget.dataset.index;
    this.data.selectSkuId = e.currentTarget.dataset.skuId;
    this.data.stock = e.currentTarget.dataset.stock;
    this.setData({
      active: active,
      stock: this.data.stock,
    });
  },

  goToCart() {
    RouterUtil.go('/pages/cart/cart');
  },

  getCartCount() {
    CartService.getCartCount().then((res) => {
      wx.setStorageSync('cartNum', res.data.data);
      this.setData({
        cartNum: res.data.data,
      });
    });
  },

  getAllCarts() {
    CartService.getAllCarts().then((res) => {
      this.data.carts = res.data.data.valid_carts;
    });
  },

  getGoodsAttr() {
    this.data.goodsAttr = '';
    this.data.goodsAttrs = [];
    this.data.carts.forEach((cart) => {
      this.data.cartIds.push(cart.goods_sku_id);
    });
    CartService.getGoodsAttr(this.data.selectSkuId).then((res) => {
      res.data.data.forEach((item, index) => {
        this.data.goodsAttrs.push(item);
      });
      if (this.data.goodsAttrs.length > 0 && !this.data.cartIds.includes(this.data.selectSkuId)) {
        wx.showActionSheet({
          itemList: this.data.goodsAttrs,
          success: (res) => {
            this.data.goodsAttr = this.data.goodsAttrs[res.tapIndex];
            CartService.addCart(this.data.selectSkuId, this.data.goodsAttr)
              .then((res) => {
                this.getCartCount();
                this.getAllCarts();
              })
              .catch((error) => {
                wx.showToast({
                  title: error.data.message,
                  icon: 'none',
                });
              });
          },
        });
      } else {
        this.addCart();
      }
    });
  },

  addCart() {
    this.data.carts.forEach((cart) => {
      if (this.data.selectSkuId === cart.goods_sku_id) {
        this.data.goodsAttr = cart.goods_attr;
      }
    });
    CartService.addCart(this.data.selectSkuId, this.data.goodsAttr)
      .then((res) => {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000,
        });
        this.getCartCount();
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000,
        });
      });
  },

  goToDescripte() {
    RouterUtil.go('/pages/goodsDescription/goodsDescription');
  },

  getDetail() {
    GoodsService.getDetail(this.data.spuId)
      .then((res) => {
        wx.hideLoading();
        const goodsInfo = res.data.data;
        this.data.selectSkuId = goodsInfo.goods_sku_list[0].id;
        this.data.stock = goodsInfo.goods_sku_list[0].stock;
        this.setData({
          goodsInfo: goodsInfo,
          stock: this.data.stock,
        });
        if (goodsInfo.goods_spu_details_image.length > 0) {
          this.imgH(goodsInfo.goods_spu_details_image[0].details_img_url);
        }
        this.getCartCount();
        this.getAllCarts();
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000,
        });
      });
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
          duration: 2000,
        });
      });
  },

  getCollectStatus() {
    GoodsService.getCollectStatus(this.data.spuId)
      .then((res) => {
        this.getDetail();
        const collectionStatus = Boolean(res.data.data.status);
        this.setData({
          collectionStatus: collectionStatus,
        });
      })
      .catch((res) => {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000,
        });
      });
  },

  //图片滑动事件
  change(e) {
    const index = e.detail.current;
    const imgUrls = this.data.goodsInfo.goods_spu_details_image;
    this.imgH(imgUrls[index].details_img_url);
  },

  //获取图片的高度，把它设置成swiper的高度
  imgH(e) {
    const winWid = wx.getSystemInfoSync().windowWidth * 2;
    wx.getImageInfo({
      //获取图片长宽等信息
      src: e,
      success: (res) => {
        const imgw = res.width;
        const imgh = res.height;
        const swiperH = (winWid * imgh) / imgw;
        this.setData({
          swiperHeight: swiperH, //设置高度
        });
      },
    });
  },

  onLoad(option) {
    wx.showLoading({
      title: '加载中',
    });
    this.data.spuId = option.goodId;
    this.getCollectStatus();
    this.getUser();
    this.getshippingCharge();
  },
});
