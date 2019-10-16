import * as GoodsService from '../../services/GoodsService';
import * as CartService from '../../services/CartService';
import * as RouterUtil from '../../utils/RouterUtil';
import throttle from '../../utils/util';

Page({
  data: {
    showClear: false, // 清除图标展示与否
    inputVal: '',
    showHistory: true, // 历史列表展示与否
    showSpuName: false, // 搜索商品名称展示与否
    HistoryList: [],
    HotList: [],
    goodsList: [],
    goodsDetailList: [],
    recommendedList: [], // 推荐商品列表
    idSelected: [], // 已被选在购物车的商品id列表
    goodSkuId: [], // 推荐商品的skuId列表

    // 属性相关
    skuId: 0,
    carts: [], // 购物车信息
    cartIds: [], // 购物车商品id
    goodsAttrs: [], // 商品属性列表
    goodsAttr: '', // 商品属性
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.goodId;
    RouterUtil.go(`/pages/goodsDetail/goodsDetail?goodId=${id}`);
  },

  bindKeyInput(e) {
    this.data.inputVal = e.detail.value;
    if (this.data.inputVal.trim() === '') {
      this.data.goodsList = [];
      this.data.goodsDetailList = [];
      this.data.showHistory = true;
    } else {
      this.data.showHistory = false;
      this.fuzzySearchGoodsIdName();
    }
    this.setData({
      showHistory: this.data.showHistory,
      inputVal: this.data.inputVal,
    });
  },

  bindconfirm(e) {
    this.data.inputVal = e.detail.value;
    this.fuzzySearchGoodsSpu();
  },

  getHistoryList() {
    if (this.data.inputVal !== '') {
      if (this.data.HistoryList.length > 0) {
        // 有数据的话 判断
        if (this.data.HistoryList.indexOf(this.data.inputVal) !== -1) {
          // 有相同的，先删除 再添加
          this.data.HistoryList.splice(this.data.HistoryList.indexOf(this.data.inputVal), 1);
          this.data.HistoryList.unshift(this.data.inputVal);
        } else {
          // 没有相同的 添加
          this.data.HistoryList.unshift(this.data.inputVal);
        }
      } else {
        // 没有数据 添加
        this.data.HistoryList.unshift(this.data.inputVal);
      }
    }
    if (this.data.HistoryList.length > 6) {
      // 保留六个值
      this.data.HistoryList.pop();
    }
    this.setData({
      HistoryList: this.data.HistoryList,
    });
    wx.setStorageSync('historyList', this.data.HistoryList);
  },

  // 商品名列表
  fuzzySearchGoodsIdName: throttle.throttle(function(e) {
    GoodsService.fuzzySearchGoodsIdName(this.data.inputVal)
      .then((res) => {
        const goodsList = res.data.data;
        this.data.showSpuName = true;
        this.setData({
          goodsList: goodsList,
          showSpuName: this.data.showSpuName,
        });
      })
      .catch((res) => {});
  }, 500),

  // 商品详情
  fuzzySearchGoodsSpu() {
    GoodsService.fuzzySearchGoodsSpu(this.data.inputVal)
      .then((res) => {
        this.getHistoryList();
        const goodsDetailList = res.data.data;
        this.setData({
          goodsDetailList: goodsDetailList,
          showSpuName: false,
        });
      })
      .catch((res) => {});
  },

  exchangeVal(e) {
    this.data.inputVal = e.currentTarget.dataset.newVal;
    this.setData({
      inputVal: this.data.inputVal,
      showHistory: false,
    });
    this.fuzzySearchGoodsIdName();
  },

  clearInput() {
    this.setData({
      inputVal: '',
      showHistory: true,
    });
  },

  getHotSearch() {
    GoodsService.getHotSearch()
      .then((res) => {
        this.data.HotList = res.data.data;
        this.setData({
          HistoryList: this.data.HistoryList,
          HotList: this.data.HotList,
        });
      })
      .catch(() => {});
  },

  getRecommended() {
    GoodsService.getRecommended()
      .then((res) => {
        this.data.goodSkuId = [];
        this.data.recommendedList = res.data.data;
        this.data.recommendedList.forEach((item) => {
          this.data.goodSkuId.push(item.goods_sku_info.id);
        });
        this.setData({
          recommendedList: this.data.recommendedList,
        });
        this.getCartNumber();
      })
      .catch(() => {});
  },

  getCartCount() {
    CartService.getCartCount().then((res) => {
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
        wx.showActionSheet({
          itemList: this.data.goodsAttrs,
          success: (res) => {
            this.data.goodsAttr = this.data.goodsAttrs[res.tapIndex];
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
                });
              });
          },
          fail(res) {},
        });
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
      .catch(() => {});
  },

  onShow: function() {
    this.data.HistoryList = wx.getStorageSync('historyList') || [];
    this.getHotSearch();
    this.getRecommended();
  },
});
