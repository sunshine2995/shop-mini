// pages/sort/sort.js
var app = getApp();
var GoodsService = require('../../utils/services/GoodsService.js');
var CartService = require('../../utils/services/CartService.js');

//声明全局变量
let proListToTop = [],
  menuToTop = [],
  MENU = 0,
  windowHeight, timeoutId;
// MENU ==> 是否为点击左侧进行滚动的，如果是，则不需要再次设置左侧的激活状态

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentActiveIndex: 0,
    oneList: [], // 一级分类标题列表
    twoList: [], // 二级分类标题列表
    currentTab: 1, // 预设当前项的值
    oneId: 0, // 一级分类Id
    scrollLeft: 0, // tab标题的滚动条位置


    idSelected: [],
    goodSkuId: [],

    // 属性相关
    skuId: 0,
    carts: [], // 购物车信息
    cartIds: [], // 购物车商品id
    goodsAttrs: [], // 商品属性列表
    goodsAttr: '', // 商品属性
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.goodId;
    wx.navigateTo({
      url: `/pages/goodsDetail/goodsDetail?goodId=${id}`,
    })
  },

  sortTest() {
    wx.navigateTo({
      url: '/pages/sortTest/sort',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // onLoad(option) {
  //   if (option.oneId) {
  //     this.data.oneId = option.oneId;
  //   }
  //   console.log(option,'oneId');
  // },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getOneCategory();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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

  getAllGoods(oneId) {
    this.setData({
      twoList: [],
    })
    wx.showLoading({
      title: '加载中',
    })
    GoodsService.getAllGoods(oneId)
      .then((res) => {
        this.data.twoList = res.data.data;
        this.setData({
          twoList: res.data.data,
        })
        this.data.goodSkuId = [];
        this.data.twoList.forEach((item) => {
          item.goods_spu_list.forEach((spu) => {
            spu.goods_sku_list.forEach((sku) => {
              this.data.goodSkuId.push(sku.id);
            });
          });
        });
        this.getCartNumber();
        setTimeout(() => {
          this.getAllRects()
        }, 20)
        // wx.hideLoading();
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000
        })
      });
  },

  getOneCategory() {
    GoodsService.getOneCategory()
      .then((res) => {
        this.data.oneList = res.data.data;
        if (+app.globalData.sortOneId !== 0) {
          this.data.currentTab = this.data.oneList.findIndex((item) => {
            return +item.id === +app.globalData.sortOneId;
          });
        }
        this.checkCor();
        const oneId = this.data.oneList[this.data.currentTab].id
        if (!this.data.twoList.length || +app.globalData.sortOneId !== 0) {
          wx.showLoading({
            title: '加载中',
          })
          this.getAllGoods(oneId);
        }
        app.globalData.sortOneId = 0;
        this.setData({
          currentTab: this.data.currentTab,
          oneList: this.data.oneList,
        });
        // wx.hideLoading();
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000
        })
      });
  },

  // 点击标题切换当前页时改变样式
  swichNav(e) {
    const index = e.target.dataset.current;
    const oneId = e.target.dataset.oneId;
    if (this.data.currentTab == index) {
      return false;
    } else {
      this.setData({
        currentTab: index
      })
    }
    this.data.currentActiveIndex = 0;
    this.data.rightProTop = 0;
    this.checkCor();
    this.getAllGoods(oneId);
    this.setData({
      currentActiveIndex: this.data.currentActiveIndex,
      rightProTop: 0,
    })
  },


  checkCor() {
    console.log(this.data.currentTab,'this.data.currentTab')
    if (this.data.currentTab === 4) {
      this.setData({
        scrollLeft: 260,
      })
    } else if (this.data.currentTab >= 5) {
      this.setData({
        scrollLeft: 500,
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },


  changeMenu(e) {
    console.log(e.target.id, 'ffffff-----', proListToTop);
    // 改变左侧tab栏操作
    if (Number(e.target.id) === this.data.currentActiveIndex) return
    MENU = 1
    this.setData({
      currentActiveIndex: Number(e.target.id),
      rightProTop: proListToTop[Number(e.target.id)]
    })
    this.setMenuAnimation(Number(e.target.id))
    console.log(this.data.currentActiveIndex, 'currentActiveIndex', this.data.rightProTop, 'rightProTop', )
  },
  scroll(e) {
    let index;
    console.log('ffffff-----', proListToTop);
    for (let i = 0; i < proListToTop.length; i++) {
      if (e.detail.scrollTop < proListToTop[i] && i !== 0 && e.detail.scrollTop > proListToTop[i - 1]) {
        console.log(i, 'i', e.detail.scrollTop, 'e.detail.scrollTop', proListToTop[i], 'proListToTop[i]', proListToTop[i - 1])
        return this.setDis(i)
      } else {
        index = i;
      }
    }
    // 找不到匹配项，默认显示第一个数据
    if (!MENU && this.data.currentActiveIndex !== 0) {
      this.setData({
        currentActiveIndex: index,
      })
    }
    MENU = 0
  },
  setDis(i) {
    // 设置左侧menu栏的选中状态
    if (i !== this.data.currentActiveIndex + 1 && !MENU) {
      this.setData({
        currentActiveIndex: i - 1
      })
    }
    MENU = 0
    this.setMenuAnimation(i)
  },
  setMenuAnimation(i) {
    // 设置动画，使menu滚动到指定位置。
    let self = this
    console.log(33)
    if (menuToTop[i].animate) {
      console.log(11111)
      // 节流操作
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        console.log(12138)
        self.setData({
          leftMenuTop: (menuToTop[i].top - windowHeight)
        })
      }, 50)
    } else {
      console.log(11)
      if (this.data.leftMenuTop === 0) return
      console.log(22)
      this.setData({
        leftMenuTop: 0
      })
    }
  },
  getActiveReacts() {
    wx.createSelectorQuery().selectAll('.menu-active').boundingClientRect(function(rects) {
      return rects[0].top
    }).exec()
  },
  getAllRects() {
    // 获取商品数组的位置信息
    proListToTop = [];
    wx.createSelectorQuery().selectAll('.pro-item').boundingClientRect(function(rects) {
      rects.forEach(function(rect) {
        // 这里减去44是根据你的滚动区域距离头部的高度，如果没有高度，可以将其删去
        proListToTop.push(rect.top - 73)
      })
    }).exec()


    // 获取menu数组的位置信息
    wx.createSelectorQuery().selectAll('.menu-item').boundingClientRect(function(rects) {
      wx.getSystemInfo({
        success: function(res) {
          console.log(res);
          windowHeight = res.windowHeight / 2
          // console.log(windowHeight)
          rects.forEach(function(rect) {
            menuToTop.push({
              top: rect.top,
              animate: rect.top > windowHeight
            })
          })
        }
      })
    }).exec()
  },
  // 获取系统的高度信息
  getSystemInfo() {
    let self = this
    wx.getSystemInfo({
      success: function(res) {
        windowHeight = res.windowHeight / 2
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})