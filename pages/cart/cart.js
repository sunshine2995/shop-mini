// pages/cart/cart.js
var CartService = require('../../utils/services/CartService.js');
var GiftService = require('../../utils/services/GiftService.js');
var UserService = require('../../utils/services/UseService.js');
const app = getApp();

Page({
  data: {
    validCarts: [], //有效购物车数据
    invalidCarts: [], //失效购物车数据
    total: 0, //总金额
    discountMoney: 0, //折扣优惠金额
    finallyMoney: 0, //总金额-折扣优惠金额
    allsel: false, //全选
    selarr: [], //选择的商品
    hintText: '', //提示的内容
    hintShow: false, //是否显示提示
    guessList: [], //猜你喜欢列表
    idSelected: [], // 已被选在购物车的商品id列表
    goodSkuId: [], // 推荐商品的skuId列表
    invalidSkuIds: [], // 失效商品id列表
    selectedIds: [], // 被选中商品的Id列表

    // 属性相关
    skuId: 0,
    carts: [], // 购物车信息
    cartIds: [], // 购物车商品id
    goodsAttrs: [], // 商品属性列表
    goodsAttr: '', // 商品属性

    // 赠礼相关
    showGiftTip: false, // 是否显示赠礼提示
    showGiftButton: false, // 是否显示赠礼按钮
    giftTip: '', // 赠礼提示
    giftData: {}, // 已选择赠礼信息
    userInfo: {}, // 用户信息
    chooseGiftId: 0, // 已选择赠礼Id
    shipping: 0, // 免配送费条件
    isShowCurtain: false, // 遮罩层
    phoneNum: '', // 用户手机号
  },

  hideCurtain() {
    this.setData({
      isShowCurtain: false,
    });
  },

  showCurtain() {
    this.setData({
      isShowCurtain: true,
    });
  },

  bindPhone() {
    this.getUser();
    this.setData({
      isShowCurtain: false,
    });
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.goodId;
    wx.navigateTo({
      url: `/pages/goodsDetail/goodsDetail?goodId=${id}`,
    });
  },

  goHome() {
    wx.switchTab({
      url: '/pages/home/home',
    });
  },

  goSubmit() {
    if (this.data.selectedIds.length === 0) {
      wx.showToast({
        title: '未选择商品呢',
        icon: 'none',
      });
    } else if (!this.data.phoneNum) {
      this.setData({
        isShowCurtain: true,
      });
    } else {
      wx.navigateTo({
        url: '/pages/order/submit/submit',
      });
    }
  },

  goCollectGood() {
    wx.switchTab({
      url: '/pages/home/home',
    });
  },

  goToChooseGift() {
    wx.navigateTo({
      url: `/pages/activity/chooseGift/chooseGift?money=${this.data.finallyMoney}`,
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

  getUser() {
    UserService.getUser()
      .then((res) => {
        this.setData({
          userInfo: res.data.data,
          phoneNum: res.data.data.phone,
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

  //点击全选
  allcheckTap() {
    let shopcar = this.data.validCarts,
      allsel = !this.data.allsel, //点击全选后allsel变化
      total = 0,
      discountMoney = 0,
      finallyMoney = 0;
    for (let i = 0, len = shopcar.length; i < len; i++) {
      shopcar[i].check = allsel; //所有商品的选中状态和allsel值一样
      if (allsel) {
        //如果为选中状态则计算商品的价格
        total += shopcar[i].price * shopcar[i].goods_sku_num;
        if (shopcar[i].reduce_money) {
          discountMoney += shopcar[i].reduce_money * shopcar[i].goods_sku_num;
        }
      }
    }
    finallyMoney = total - discountMoney;
    this.getCartGift(finallyMoney);
    if (allsel) {
      shopcar.forEach((item) => {
        this.data.selarr.push(item);
      });
    } else {
      this.data.selarr = [];
    }
    // this.data.selarr = allsel ? shopcar : []; //如果选中状态为true那么所有商品为选中状态，将物品加入选中变量，否则为空
    this.setData({
      allsel: allsel,
      validCarts: shopcar,
      total: total,
      discountMoney: discountMoney,
      finallyMoney: finallyMoney,
      selarr: this.data.selarr,
    });
    this.data.selectedIds = [];
    this.data.selarr.forEach((item) => {
      this.data.selectedIds.push(item.goods_sku_id);
    });
    wx.setStorageSync('selectedIds', this.data.selectedIds);
  },

  //判断是否为全选
  judgmentAll() {
    let shopcar = this.data.validCarts,
      shoplen = shopcar.length,
      lenIndex = 0; //选中的物品的个数
    for (let i = 0; i < shoplen; i++) {
      //计算购物车选中的商品的个数
      shopcar[i].check && lenIndex++;
    }
    this.setData({
      allsel: lenIndex == shoplen, //如果购物车选中的个数和购物车里货物的总数相同，则为全选，反之为未全选
    });
    this.data.selectedIds = [];
    this.data.selarr.forEach((item) => {
      this.data.selectedIds.push(item.goods_sku_id);
    });
    wx.setStorageSync('selectedIds', this.data.selectedIds);
  },

  //点击单个选择按钮
  checkTap(e) {
    const Index = e.currentTarget.dataset.index;
    let shopcar = this.data.validCarts,
      total = this.data.total,
      discountMoney = this.data.discountMoney,
      selarr = this.data.selarr,
      finallyMoney = this.data.finallyMoney;
    shopcar[Index].check = !shopcar[Index].check || false;
    if (shopcar[Index].check) {
      total += shopcar[Index].goods_sku_num * shopcar[Index].price;
      if (shopcar[Index].reduce_money) {
        discountMoney += shopcar[Index].reduce_money * shopcar[Index].goods_sku_num;
      }
      selarr.push(shopcar[Index]);
    } else {
      total -= shopcar[Index].goods_sku_num * shopcar[Index].price;
      if (shopcar[Index].reduce_money) {
        discountMoney -= shopcar[Index].reduce_money * shopcar[Index].goods_sku_num;
      }
      selarr.forEach((item, index) => {
        if (shopcar[Index].goods_sku_id == item.goods_sku_id) {
          selarr.splice(index, 1);
        }
      });
      // for (let i = 0, len = selarr.length; i < len; i++) {
      //   if (shopcar[Index].id == selarr[i].id) {
      //     selarr.splice(i, 1);
      //     console.log('splice1111111')
      //     break;
      //   }
      // }
    }
    finallyMoney = total - discountMoney;
    this.getCartGift(finallyMoney);
    this.setData({
      validCarts: shopcar,
      total: total,
      discountMoney: discountMoney,
      finallyMoney: finallyMoney,
      selarr: selarr,
    });
    this.judgmentAll(); //每次按钮点击后都判断是否满足全选的条件
  },

  incrementQuantity(e) {
    let Index = e.currentTarget.dataset.index; //点击的商品下标值
    let shopcar = this.data.validCarts;
    let total = this.data.total; //总计
    let discountMoney = this.data.discountMoney;
    let finallyMoney = this.data.finallyMoney; //实际
    shopcar[Index].check && (total += +shopcar[Index].price); //如果商品为选中的，则合计价格-商品单价
    shopcar[Index].check && shopcar[Index].reduce_money && (discountMoney += +shopcar[Index].reduce_money);
    total = Number(total.toFixed(2));
    finallyMoney = total - discountMoney;
    this.getCartGift(finallyMoney);
    CartService.updateCart(shopcar[Index].goods_sku_id, shopcar[Index].goods_sku_num + 1)
      .then((res) => {
        shopcar[Index].goods_sku_num = shopcar[Index].goods_sku_num + 1;
        this.setData({
          validCarts: shopcar,
          total: total,
          discountMoney: discountMoney,
          finallyMoney: finallyMoney,
        });
        this.getCartCount();
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
        });
      });
  },

  decrementQuantity(e) {
    console.log('decrementQuantity');
    let Index = e.currentTarget.dataset.index, //点击的商品下标值
      shopcar = this.data.validCarts,
      total = this.data.total, //总计
      discountMoney = this.data.discountMoney,
      finallyMoney = this.data.finallyMoney; //实际
    this.getCartGift(finallyMoney);
    if (shopcar[Index].goods_sku_num === 1) {
      var _this = this;
      wx.showModal({
        title: '删除商品',
        content: '确定要删除该商品吗？',
        confirmColor: '#11A24A',
        success(res) {
          if (res.confirm) {
            _this.deleteCart(shopcar[Index].goods_sku_id);
            shopcar[Index].check && (total -= +shopcar[Index].price); //如果商品为选中的，则合计价格-商品单价
            shopcar[Index].check && shopcar[Index].reduce_money && (discountMoney -= +shopcar[Index].reduce_money);
            total = Number(total.toFixed(2));
            finallyMoney = total - discountMoney;
            _this.setData({
              total: total,
              discountMoney: discountMoney,
              finallyMoney: finallyMoney,
            });
          } else if (res.cancel) {
          }
        },
      });
    } else {
      CartService.updateCart(shopcar[Index].goods_sku_id, shopcar[Index].goods_sku_num - 1)
        .then((res) => {
          shopcar[Index].goods_sku_num = shopcar[Index].goods_sku_num - 1;
          shopcar[Index].check && (total -= +shopcar[Index].price); //如果商品为选中的，则合计价格-商品单价
          shopcar[Index].check && shopcar[Index].reduce_money && (discountMoney -= +shopcar[Index].reduce_money);
          total = Number(total.toFixed(2));
          finallyMoney = total - discountMoney;
          this.setData({
            validCarts: shopcar,
            total: total,
            discountMoney: discountMoney,
            finallyMoney: finallyMoney,
          });
          this.getCartCount();
        })
        .catch((error) => {
          wx.showToast({
            title: error.data.message,
          });
        });
    }
  },

  // 删除购物车
  deleteCart(skuId) {
    CartService.deleteCart(skuId)
      .then((res) => {
        this.data.selectedIds.forEach((item, index) => {
          if (skuId === item) {
            this.data.selectedIds.splice(index, 1);
          }
        });
        wx.setStorageSync('selectedIds', this.data.selectedIds);
        this.data.validCarts.forEach((item, index) => {
          if (skuId === item.goods_sku_id) {
            this.data.validCarts.splice(index, 1);
          }
          this.setData({
            validCarts: this.data.validCarts,
            selectedIds: this.data.selectedIds,
          });
        });
        this.getCartCount();
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
        });
      });
  },

  // 删除选中商品
  deleteGoods() {
    if (this.data.selectedIds.length === 0) {
      wx.showToast({
        title: '请选择要删除的商品',
        icon: 'none',
      });
    } else {
      var _this = this;
      wx.showModal({
        title: '批量删除商品',
        content: '确定要删除选中商品吗？',
        confirmColor: '#11A24A',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '',
            });
            CartService.deleteCarts(_this.data.selectedIds.map(Number))
              .then((res) => {
                wx.setStorageSync('selectedIds', []);
                wx.hideLoading();
                _this.getAllCarts();
                _this.selectedIds = [];
              })
              .catch((error) => {
                wx.showToast({
                  title: error.data.message,
                  icon: 'none',
                });
              });
          } else if (res.cancel) {
          }
        },
      });
    }
  },

  // 清空失效商品
  deleteInvalidGoods() {
    var _this = this;
    wx.showModal({
      title: '清除失效商品',
      content: '确定要清除失效商品吗？',
      confirmColor: '#11A24A',
      success(res) {
        if (res.confirm) {
          console.log(_this.data.invalidSkuIds.map(Number));
          CartService.deleteCarts(_this.data.invalidSkuIds.map(Number))
            .then((res) => {
              wx.showToast({
                title: res.data.message,
              });
              _this.getAllCarts();
            })
            .catch((error) => {
              wx.showToast({
                title: error.data.message,
                icon: 'none',
              });
            });
        } else if (res.cancel) {
        }
      },
    });
  },

  // 获取购物车数量
  getCartCount() {
    CartService.getCartCount().then((res) => {
      wx.setStorageSync('cartNum', res.data.data);
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
      if (this.data.goodsAttrs.length > 0) {
        var _this = this;
        wx.showActionSheet({
          itemList: _this.data.goodsAttrs,
          success(res) {
            console.log(res.tapIndex);
            _this.data.goodsAttr = _this.data.goodsAttrs[res.tapIndex];
            console.log(_this.data.goodsAttr);
            if (_this.data.carts.length === 0) {
              CartService.addCart(_this.data.skuId, _this.data.goodsAttr)
                .then((res) => {
                  _this.data.idSelected.forEach((item) => {
                    if (+item.id === +_this.data.skuId) {
                      item.num = res.data.data.goods_sku_num;
                    }
                  });
                  _this.getAllCarts();
                })
                .catch((error) => {
                  wx.showToast({
                    title: error.data.message,
                    icon: 'none',
                  });
                });
            } else {
              CartService.editGoodsAttr(_this.data.skuId, _this.data.goodsAttr)
                .then((res) => {
                  wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                  });
                  _this.data.carts.forEach((item) => {
                    if (_this.data.skuId === item.goods_sku_id) {
                      item.goods_attr = _this.data.goodsAttr;
                    }
                  });
                  _this.setData({
                    validCarts: _this.data.carts,
                  });
                })
                .catch((error) => {
                  wx.showToast({
                    title: error.data.message,
                    icon: 'none',
                  });
                });
            }
          },
          fail(res) {
            console.log(res.errMsg);
          },
        });
      } else {
        this.addCart();
      }
    });
  },

  addCart() {
    CartService.addCart(this.data.skuId, this.data.goodsAttr)
      .then((res) => {
        this.data.idSelected.forEach((item) => {
          if (+item.id === +this.data.skuId) {
            item.num = res.data.data.goods_sku_num;
          }
        });
        this.getAllCarts();
      })
      .catch(() => {});
  },

  // 猜你喜欢
  getLikeList() {
    wx.showLoading({
      title: '',
      icon: 'Loading',
    });
    CartService.getLikeList()
      .then((res) => {
        wx.hideLoading();
        this.data.guessList = res.data.data;
        this.setData({
          guessList: this.data.guessList,
        });
      })
      .catch((error) => {
        wx.showToast({
          title: '',
          icon: 'none',
        });
      });
  },

  onLoad: function(options) {},
  onReady: function() {},

  getAllCarts() {
    CartService.getAllCarts()
      .then((res) => {
        this.getCartCount();
        if (res.data.data.valid_carts.length === 0 && res.data.data.invalid_carts.length === 0) {
          this.data.carts = res.data.data.valid_carts;
          this.data.validCarts = res.data.data.valid_carts;
          this.data.invalidCarts = res.data.data.invalid_carts;
          this.setData({
            validCarts: this.data.validCarts,
            invalidCarts: this.data.invalidCarts,
          });
          console.log(this.data.validCarts, 'this.data.validCarts');
          this.getLikeList();
        } else {
          console.log(
            this.data.validCarts.length,
            'res.data.data.valid_carts.length',
            this.data.invalidCarts.length,
            'res.data.data.invalid_carts.length',
          );
          this.data.validCarts = res.data.data.valid_carts;
          this.data.carts = res.data.data.valid_carts;
          this.data.invalidCarts = res.data.data.invalid_carts;
          this.data.invalidCarts.forEach((item) => {
            this.data.invalidSkuIds.push(item.goods_sku_id);
          });
          this.data.selarr = [];
          var selectedIds = wx.getStorageSync('selectedIds');
          var total = 0;
          var discountMoney = 0;
          var finallyMoney = 0;

          if (selectedIds.length) {
            this.data.validCarts.forEach((item) => {
              selectedIds.forEach((selectedId) => {
                if (+item.goods_sku_id === +selectedId) {
                  item.check = true;
                }
              });
            });
          }
          var selarr = this.data.selarr;
          for (let i = 0, len = this.data.validCarts.length; i < len; i++) {
            //这里是对选中的商品的价格进行总结
            if (this.data.validCarts[i].check) {
              total += this.data.validCarts[i].goods_sku_num * this.data.validCarts[i].price;
              if (this.data.validCarts[i].reduce_money) {
                discountMoney += this.data.validCarts[i].reduce_money * this.data.validCarts[i].goods_sku_num;
              }
              finallyMoney = total - discountMoney;
              selarr.push(this.data.validCarts[i]);
            }
          }

          this.getCartGift(finallyMoney);
          this.setData({
            validCarts: this.data.validCarts,
            invalidCarts: this.data.invalidCarts,
            total: total,
            discountMoney: discountMoney,
            finallyMoney: finallyMoney,
            selarr: selarr,
          });
          this.judgmentAll(); //判断是否全选
        }

        this.getLikeList();
      })
      .catch((error) => {});
  },

  showCartGift() {
    GiftService.showCartGift(app.globalData.chooseGiftId)
      .then((res) => {
        this.data.giftData = res.data.data;
        this.setData({
          giftData: this.data.giftData,
          chooseGiftId: app.globalData.chooseGiftId,
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

  getCartGift(money) {
    wx.showLoading({
      title: '',
    });
    GiftService.getCartGift(money)
      .then((res) => {
        wx.hideLoading();
        if (res.data.data.flag === 0) {
          this.data.showGiftTip = true;
          app.globalData.chooseGiftId = 0;
          this.setData({
            giftData: this.data.giftData,
            chooseGiftId: app.globalData.chooseGiftId,
          });
        } else {
          this.data.showGiftTip = false;
        }
        console.log(app.globalData.chooseGiftId, this.data.showGiftTip);
        // this.data.showGiftTip = res.data.data.flag === 0;
        this.data.showGiftButton = res.data.data.flag === 1;
        this.data.giftTip = res.data.data.reason;
        this.setData({
          showGiftTip: this.data.showGiftTip,
          showGiftButton: this.data.showGiftButton,
          giftTip: this.data.giftTip,
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

  /**   * 生命周期函数--监听页面显示   */
  onShow() {
    this.getUser();
    this.getshippingCharge();
    this.getAllCarts();
    this.data.chooseGiftId = app.globalData.chooseGiftId;
    if (this.data.chooseGiftId !== 0) {
      this.showCartGift();
    }
  },
});
