var GoodsService = require('../../utils/services/GoodsService.js');
var CartService = require('../../utils/services/CartService.js');

Page({
  data: {
    idSelected: [],
    goodSkuId: [],

    // 属性相关
    skuId: 0,
    carts: [], // 购物车信息
    cartIds: [], // 购物车商品id
    goodsAttrs: [], // 商品属性列表
    goodsAttr: '', // 商品属性
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.goodId;
    wx.navigateTo({
      url: `/pages/goodsDetail/goodsDetail?goodId=${id}`,
    })
  },

  onShow: function(options) {
    this.getDiscountList();
  },

  getDiscountList() {
    wx.showLoading({
      title: '',
    })
    GoodsService.getDiscountList()
      .then((res) => {
        wx.hideLoading();
        var discountList = res.data.data;
        this.setData({
          discountList: discountList,
        });
        this.data.goodSkuId = [];
        discountList.forEach((item) => {
          item.discount_sku_info.forEach((sku) => {
            this.data.goodSkuId.push(sku.id);
          });
        });
        this.getCartNumber();
      })
      .catch((res) => {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      })
  },

  getCartCount() {
    CartService.getCartCount()
      .then((res) => {
        wx.setStorageSync('cartNum', res.data.data);
      });
  },

  getCartNumber() {
    CartService.getAllCarts().then((res) => {
      this.data.carts = res.data.data.valid_carts;
      this.data.idSelected = [];
      this.data.carts.forEach((cart) => {
        this.data.goodSkuId.forEach((goodId) => {
          if (+cart.goods_sku_id === +goodId) {
            this.data.idSelected.push({
              id: +cart.goods_sku_id,
              num: +cart.goods_sku_num,
            });
          }
        });
      });
      this.setData({
        idSelected: this.data.idSelected,
      });
      this.getCartCount();
    });
  },


  // 获取商品属性
  getGoodsAttr(e) {
    this.data.skuId = e.currentTarget.dataset.goodSkuId;
    this.data.goodsAttr = '';
    this.data.goodsAttrs = [];
    this.data.carts.forEach((cart) => {
      this.data.cartIds.push(cart.goods_sku_id);
    });
    CartService.getGoodsAttr(this.data.skuId).then((res) => {
      res.data.data.forEach((item, index) => {
        this.data.goodsAttrs.push(item);
      });
      if (this.data.goodsAttrs.length > 0 && !this.data.cartIds.includes(this.data.skuId)) {
        var _this = this;
        wx.showActionSheet({
          itemList: _this.data.goodsAttrs,
          success(res) {
            console.log(res.tapIndex)
            _this.data.goodsAttr = _this.data.goodsAttrs[res.tapIndex];
            console.log(_this.data.goodsAttr)
            CartService.addCart(_this.data.skuId, _this.data.goodsAttr)
              .then((res) => {
                _this.data.idSelected.forEach((item) => {
                  if (+item.id === +_this.data.skuId) {
                    item.num = res.data.data.goods_sku_num;
                  }
                });
                _this.getCartNumber();
              })
              .catch((error) => {
                wx.showToast({
                  title: error.data.message,
                  icon: 'none',
                })
              });
          },
          fail(res) {
            console.log(res.errMsg)
          }
        })
      } else {
        this.addCart();
      }
    });
  },

  addCart() {
    this.data.carts.forEach((cart) => {
      if (this.data.skuId === cart.goods_sku_id) {
        this.data.goodsAttr = cart.goods_attr;
      }
      console.log(this.data.skuId, 'addCART', this.data.goodsAttr, 'gggggg');
    });
    CartService.addCart(this.data.skuId, this.data.goodsAttr)
      .then((res) => {
        this.data.idSelected.forEach((item) => {
          if (+item.id === +this.data.skuId) {
            item.num = res.data.data.goods_sku_num;
          }
        });
        this.getCartNumber();
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
        })
      });
  },

})