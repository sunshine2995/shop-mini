var GoodsService = require('../../utils/services/GoodsService.js');
var CartService = require('../../utils/services/CartService.js');

Page({
  data: {
    idSelected: [],
    goodSkuId: [],
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
      const carts = res.data.data.valid_carts;
      this.data.idSelected = [];
      carts.forEach((cart) => {
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

  addCart(e) {
    const goodsSkuId = e.currentTarget.dataset.goodSkuId;
    CartService.addCart(goodsSkuId)
      .then((res) => {
        this.data.idSelected.forEach((item) => {
          if (+item.id === +goodsSkuId) {
            item.num = res.data.data.goods_sku_num;
          }
        });
        this.getCartNumber();
      })
      .catch(() => {});
  },

})