"use strict";
var UserService = require('../../utils/services/UseService.js');
var GoodsService = require('../../utils/services/GoodsService.js');
var CartService = require('../../utils/services/CartService.js');
const app = getApp()

Page({
  data: {
    UserInfo: [],
    idSelected: [],
    goodSkuId: [],

    // 属性相关
    skuId: 0,
    carts: [], // 购物车信息
    cartIds: [], // 购物车商品id
    goodsAttrs: [], // 商品属性列表
    goodsAttr: '', // 商品属性
  },

  getUser() {
    UserService.getUser()
      .then((res) => {
        app.globalData.userData = res.data.data;
        this.getShopInfo();
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000
        })
      });
  },

  getShopInfo() {
    UserService.getShopInfo(app.globalData.userData.current_subbranch_id)
      .then((res) => {
        app.globalData.shopInfo = res.data.data;
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000
        })
      });
  },


  goDetail(e) {
    const id = e.currentTarget.dataset.goodId;
    wx.navigateTo({
      url: `/pages/goodsDetail/goodsDetail?goodId=${id}`,
    })
  },

  // 活动页跳转页面
  bindViewTap: function(event) {
    const url = event.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },

  bindJumpPath: function(event) {
    const path = `/pages${event.currentTarget.dataset.path}${event.currentTarget.dataset.path}`;
    wx.navigateTo({
      url: path,
    })
  },

  onShow: function() {
    var inviteImages = [{
      img: "https://img.caibashi.com/07ec9d284b2577a064698ce483f7a3aa.png",
      url: '/pages/activity/newUser/newUser',
    }, {
      img: "https://img.caibashi.com/afe8aeac4d6a26f65542dac87272c6d6.png",
        url: '/pages/activity/newUser/newUser',
    }]

    var images = [{
      img: "https://img.caibashi.com/8c4ab7f7ee0fbb5a8b9413a9e1ddac27.png",
      url: '/pages/activity/newUser/newUser',
    }, {
      img: "https://img.caibashi.com/0f276789b03f793bdf076d3d49e474e3.png",
      url: '/pages/activity/newUser/newUser',
    }]

    this.setData({
      images: images,
      inviteImages: inviteImages,
    });
    this.getUser();
    this.getOneCategory();
    this.getCustom();
    this.getMarketingAlltype();
    this.getCategoryOneAllGoods();
  },

  getOneCategory() {
    wx.showLoading({
      title: '加载中',
    })
    GoodsService.getOneCategory()
      .then((res) => {
        wx.hideLoading();
        var sortTitle = res.data.data;
        this.setData({
          sortList: sortTitle,
        });
      })
      .catch(() => {

      })
  },

  getMarketingAlltype() {
    wx.showLoading({
      title: '加载中',
    })
    GoodsService.getMarketingAlltype()
      .then((res) => {
        wx.hideLoading();
        const marketingTypeList = res.data.data;
        this.setData({
          marketingTypeList: marketingTypeList,
        });
        this.data.goodSkuId = [];
        marketingTypeList.forEach((item) => {
          item.goods_spu_info.forEach((spu) => {
            spu.goods_sku_list.forEach((sku) => {
              this.data.goodSkuId.push(sku.id);
            });
          });
        });
        this.getCartNumber();
      })
      .catch(() => {

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
    this.data.cartIds = [];
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
            _this.data.goodsAttr = _this.data.goodsAttrs[res.tapIndex];
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


  getCategoryOneAllGoods() {
    wx.showLoading({
      title: '加载中',
    })
    GoodsService.getCategoryOneAllGoods()
      .then((res) => {
        wx.hideLoading();
        var categoryOneList = res.data.data;
        this.setData({
          categoryOneList: categoryOneList,
        });
      })
      .catch(() => {

      })
  },

  onReachBottom: function() {},

  getCustom() {
    wx.showLoading({
      title: '加载中',
    })
    UserService.getCustom()
      .then((res) => {
        wx.hideLoading();
        var customImg = res.data.data.phone_index_image;
        var customPath = res.data.data.index_redirect_url;
        this.setData({
          customImg: customImg,
          customPath: customPath,
        });
      })
      .catch((res) => {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      })
  }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhvbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUksQ0FBQztJQUNELElBQUksRUFBQztRQUNELFFBQVEsRUFBRSxFQUFRO0tBQ3JCO0lBQ0QsTUFBTTtRQUNGLEVBQUUsQ0FBQyxXQUFXLENBQUM7WUFDWCxPQUFPLEVBQUUsVUFBQSxHQUFHO2dCQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDcEIsQ0FBQztTQUNKLENBQUMsQ0FBQTtJQUNOLENBQUM7Q0FDSixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJQYWdlKHtcclxuICAgIGRhdGE6e1xyXG4gICAgICAgIFVzZXJJbmZvOiBbXSBhcyBbXVxyXG4gICAgfSxcclxuICAgIG9ubG9hZCgpIHtcclxuICAgICAgICB3eC5nZXRVc2VySW5mbyh7XHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufSkiXX0=