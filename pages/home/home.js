import * as UserService from '../../services/UserService';
import * as GoodsService from '../../services/GoodsService';
import * as GiftService from '../../services/GiftService';
import * as CartService from '../../services/CartService';
import * as RouterUtil from '../../utils/RouterUtil';
import * as utils from '../../utils/utils';

const app = getApp();

Page({
  data: {
    UserInfo: [],
    idSelected: [],
    goodSkuId: [],
    NewUserGoods: [], // 新人特价商品
    idNewUserSelected: [], // 购物车的新人特价商品id
    NewUserGoodId: [], // 新人特价商品id数组
    // 属性相关
    skuId: 0,
    carts: [], // 购物车信息
    cartIds: [], // 购物车商品id
    goodsAttrs: [], // 商品属性列表
    goodsAttr: '', // 商品属性
    shopInfo: {}, // 店铺信息
    showShopName: true, // 是否展示店铺名称
    inviteId: 0, // 邀请人的Id
    showImage: false, // 是否展示活动弹窗
    showPath: false, // 判断环境的变量
  },
  hideImage() {
    this.setData({
      showImage: false,
    });
  },

  jumpSort() {
    RouterUtil.go('/pages/sort/sort');
  },

  closeTip() {
    this.setData({
      showShopName: false,
    });
  },
  getNewUserEgg() {
    wx.showLoading({
      title: '领取中',
    });
    GiftService.getNewUserEgg()
      .then(() => {
        wx.hideLoading();
        this.data.showImage = false;
        this.setData({
          showImage: this.data.showImage,
        });
        wx.showToast({
          title: '领取成功',
          icon: 'none',
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
    wx.showLoading({
      title: '',
    });
    UserService.getUser()
      .then((res) => {
        wx.hideLoading();
        if (this.data.inviteId !== 0 && this.data.inviteId !== res.data.data.id && res.data.data.invite_id === 0) {
          this.inviteBind();
        }
        app.globalData.userData = res.data.data;
        if (app.globalData.userData.current_subbranch_id === 0) {
          RouterUtil.go('/pages/shopList/shopList');
        } else {
          this.getShopInfo();
        }
        this.data.showImage = res.data.data.is_new_user;
        if (this.data.showImage) {
          this.setData({
            showImage: true,
          });
        }
        this.getOneCategory();
        this.getCustom();
        this.getMarketingAlltype();
        this.getCategoryOneAllGoods();
        this.getNewUserGoods();
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000,
        });
      });
  },

  inviteBind() {
    UserService.inviteBind(this.data.inviteId)
      .then(() => {})
      .catch(() => {});
  },

  getShopInfo() {
    UserService.getShopInfo(app.globalData.userData.current_subbranch_id)
      .then((res) => {
        app.globalData.shopInfo = res.data.data;
        this.setData({
          shopInfo: res.data.data,
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

  getNewUserGoods() {
    GoodsService.getNewUserGoods()
      .then((res) => {
        this.data.NewUserGoods = res.data.data;
        this.data.NewUserGoodId = [];
        this.data.NewUserGoods.forEach((item) => {
          this.data.NewUserGoodId.push(item.sku.id);
        });
        this.setData({
          NewUserGoods: res.data.data,
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

  goDetail(e) {
    const id = e.currentTarget.dataset.goodId;
    RouterUtil.go(`/pages/goodsDetail/goodsDetail?goodId=${id}`);
  },

  goToSort(e) {
    app.globalData.sortOneId = e.currentTarget.dataset.oneId;
    RouterUtil.go('/pages/sort/sort');
  },

  toSort() {
    RouterUtil.go('/pages/sort/sort');
  },

  // 活动页跳转页面
  bindViewTap(event) {
    const url = event.currentTarget.dataset.url;
    RouterUtil.go(url);
  },

  bindJumpPath(event) {
    if (event.currentTarget.dataset.path) {
      const path = event.currentTarget.dataset.path;
      RouterUtil.go(path);
    }
  },

  onShow() {
    if (utils.inDevelopment()) {
      this.setData({
        showPath: true,
      });
    }

    const version = wx.getSystemInfoSync().SDKVersion;
    if (utils.compareVersion(version, '2.6.6') < 0) {
      wx.redirectTo({
        url: '/pages/test/test',
      });
    }

    const inviteImages = [
      {
        img: 'https://img.caibashi.com/07ec9d284b2577a064698ce483f7a3aa.png',
        url: '/pages/activity/share/share',
      },
      {
        img: 'https://img.caibashi.com/afe8aeac4d6a26f65542dac87272c6d6.png',
        url: '/pages/activity/invite/invite',
      },
    ];

    const images = [
      {
        img: 'https://img.caibashi.com/70d8999cb5bfdcdcd6b30c7cfeb579cd.png',
        url: '/pages/activity/newUser/newUser',
      },
      {
        img: 'https://img.caibashi.com/0f276789b03f793bdf076d3d49e474e3.png',
        url: '/pages/activity/rechargeGift/rechargeGift',
      },
    ];

    this.setData({
      images,
      inviteImages,
    });
    this.getUser();
  },

  getOneCategory() {
    wx.showLoading({
      title: '加载中',
    });
    GoodsService.getOneCategory()
      .then((res) => {
        wx.hideLoading();
        const sortTitle = res.data.data;
        this.setData({
          sortList: sortTitle,
        });
      })
      .catch(() => {});
  },

  getMarketingAlltype() {
    wx.showLoading({
      title: '加载中',
    });
    GoodsService.getMarketingAlltype()
      .then((res) => {
        wx.hideLoading();
        const marketingTypeList = res.data.data;
        this.setData({
          marketingTypeList,
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
      .catch(() => {});
  },

  getCartCount() {
    CartService.getCartCount().then((res) => {
      app.globalData.store.cartNum = res.data.data;
    });
  },

  getCartNumber() {
    CartService.getAllCarts().then((res) => {
      this.data.carts = res.data.data.valid_carts;
      this.data.idSelected = [];
      this.data.idNewUserSelected = [];
      this.data.carts.forEach((cart) => {
        this.data.goodSkuId.forEach((goodId) => {
          if (+cart.goods_sku_id === +goodId) {
            this.data.idSelected.push({
              id: +cart.goods_sku_id,
              num: +cart.goods_sku_num,
            });
          }
        });
        this.data.NewUserGoodId.forEach((goodId) => {
          if (+cart.goods_sku_id === +goodId) {
            this.data.idNewUserSelected.push({
              id: +cart.goods_sku_id,
              num: +cart.goods_sku_num,
            });
          }
        });
      });
      this.setData({
        idSelected: this.data.idSelected,
        idNewUserSelected: this.data.idNewUserSelected,
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
      res.data.data.forEach((item) => {
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
                this.data.idNewUserSelected.forEach((item) => {
                  if (+item.id === +this.data.skuId) {
                    item.num = res.data.goods_sku_num;
                  }
                });
                this.getCartNumber();
              })
              .catch((error) => {
                wx.showToast({
                  title: error.data.message,
                  icon: 'none',
                  duration: 2000,
                });
              });
          },
          fail() {},
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
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
        });
      });
  },

  getCategoryOneAllGoods() {
    wx.showLoading({
      title: '加载中',
    });
    GoodsService.getCategoryOneAllGoods()
      .then((res) => {
        wx.hideLoading();
        const categoryOneList = res.data.data;
        this.setData({
          categoryOneList,
        });
      })
      .catch(() => {});
  },

  getCustom() {
    wx.showLoading({
      title: '加载中',
    });
    UserService.getCustom()
      .then((res) => {
        wx.hideLoading();
        const imgData = res.data.data;
        const imgList = [];
        let customImg;
        let customPath;
        imgData.forEach((item) => {
          if (item.module_name === '首页') {
            imgList.push({
              img_url: item.img_url,
              mini_turn_url: item.mini_turn_url,
            });
          }
        });
        if (imgList.length) {
          customPath = imgList[0].mini_turn_url;
          customImg = imgList[0].img_url;
          this.setData({
            customImg,
            customPath,
          });
        }
      })
      .catch((res) => {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000,
        });
      });
  },

  onLoad(options) {
    if (options.scene) {
      this.data.inviteId = decodeURIComponent(options.scene);
    }
    if (options.invite_id) {
      this.data.inviteId = options.invite_id;
    }
  },

  onShareAppMessage() {
    return {
      title: '菜巴士，送货到家~',
      path: '/pages/home/home',
    };
  },
});
