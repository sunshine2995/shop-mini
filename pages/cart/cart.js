// pages/cart/cart.js
var CartService = require('../../utils/services/CartService.js')
Page({
  data: {
    adminShow: false, //管理      
    validCarts: [], //购物车数据      
    total: 0, //总金额      
    allsel: false, //全选      
    selarr: [], //选择的商品   
    hintText: '', //提示的内容      
    hintShow: false, //是否显示提示  
    guessList: [], //猜你喜欢列表
    idSelected: [], // 已被选在购物车的商品id列表
    goodSkuId: [], // 推荐商品的skuId列表
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.goodId;
    wx.navigateTo({
      url: `/pages/goodsDetail/goodsDetail?goodId=${id}`,
    })
  },

  goCollectGood() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },

  //点击全选  
  allcheckTap: function() {
    let shopcar = this.data.validCarts,
      allsel = !this.data.allsel, //点击全选后allsel变化
      total = 0;
    for (let i = 0, len = shopcar.length; i < len; i++) {
      shopcar[i].check = allsel; //所有商品的选中状态和allsel值一样
      if (allsel) { //如果为选中状态则计算商品的价格
        total += shopcar[i].price * shopcar[i].goods_sku_num;
      }
    }
    this.data.selarr = allsel ? shopcar : []; //如果选中状态为true那么所有商品为选中状态，将物品加入选中变量，否则为空    
    this.setData({
      allsel: allsel,
      validCarts: shopcar,
      total: total,
      selarr: this.data.selarr
    });
    console.log(this.data.selarr, 'allcheckTap')
  },
  //点击移除商品  
  deleteshopTap: function() {
    var allsel = this.data.allsel,
      shopcar = this.data.validCarts,
      selarr = this.data.selarr;
    if (allsel) {
      shopcar = [];
      this.setData({
        allsel: false
      });
    } else {
      console.log(selarr);
      for (var i = 0, len = selarr.length; i < len; i++) { //将选中的商品从购物车移除        
        console.log(selarr[i].id);
        for (var lens = shopcar.length - 1, j = lens; j >= 0; j--) {
          console.log(shopcar[j].id);
          if (selarr[i].id == shopcar[j].id) {
            shopcar.splice(j, 1);
          }
        }
      }
    }
    this.setData({
      validCarts: shopcar,
      total: 0
    });
  },
  //点击加入收藏夹，这里按自己需求写吧  
  addcollectTap: function() {

  },
  //点击管理按钮，是否显示管理的选项  
  adminTap: function() {
    this.setData({
      adminShow: !this.data.adminShow
    });
  },
  //点击单个选择按钮  
  checkTap(e) {
    const Index = e.currentTarget.dataset.index;
    console.log(this.data.validCarts, 'his.data.validCarts')
    let shopcar = this.data.validCarts,
      total = this.data.total,
      selarr = this.data.selarr;
    shopcar[Index].check = !shopcar[Index].check || false;
    if (shopcar[Index].check) {
      total += shopcar[Index].goods_sku_num * shopcar[Index].price;
      selarr.push(shopcar[Index]);
    } else {
      total -= shopcar[Index].goods_sku_num * shopcar[Index].price;
      for (let i = 0, len = selarr.length; i < len; i++) {
        if (shopcar[Index].id == selarr[i].id) {
          selarr.splice(i, 1);
          break;
        }
      }
    }
    this.setData({
      validCarts: shopcar,
      total: total,
      selarr: selarr
    });
    console.log(selarr, 'checkTap')
    this.judgmentAll(); //每次按钮点击后都判断是否满足全选的条件  
  },
  //点击加减按钮  
  numchangeTap(e) {
    let Index = e.currentTarget.dataset.index, //点击的商品下标值        
      shopcar = this.data.validCarts,
      types = e.currentTarget.dataset.types, //是加号还是减号        
      total = this.data.total; //总计    
    switch (types) {
      case 'add':
        // shopcar[Index].goods_sku_num++; //对应商品的数量+1      
        shopcar[Index].check && (total += +shopcar[Index].price); //如果商品为选中的，则合计价格+商品单价     
        this.incrementQuantity(shopcar[Index].goods_sku_id, shopcar[Index].goods_sku_num++);
        break;
      case 'minus':
        if (shopcar[Index].goods_sku_num > 1) {
          // shopcar[Index].goods_sku_num--; //对应商品的数量-1   
          shopcar[Index].check && (total -= +shopcar[Index].price); //如果商品为选中的，则合计价格-商品单价    
          this.decrementQuantity(shopcar[Index].goods_sku_id, shopcar[Index].goods_sku_num--);
        } else {
          var _this = this;
          wx.showModal({
            title: '删除商品',
            content: '确定要删除该商品吗？',
            confirmColor: '#11A24A',
            success(res) {
              if (res.confirm) {
                _this.deleteCart(shopcar[Index].goods_sku_id)
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
        break;
    }
    total = Number(total.toFixed(2));
    this.setData({
      validCarts: shopcar,
      total: total,
    });
  },

  incrementQuantity(e) {
    let Index = e.currentTarget.dataset.index; //点击的商品下标值        
    let shopcar = this.data.validCarts;
    let total = this.data.total; //总计  
    shopcar[Index].check && (total += +shopcar[Index].price); //如果商品为选中的，则合计价格-商品单价   
    total = Number(total.toFixed(2));
    console.log(shopcar, this.data.validCarts, 'ffffffff')
    CartService.updateCart(shopcar[Index].goods_sku_id, shopcar[Index].goods_sku_num + 1)
      .then((res) => {
        shopcar[Index].goods_sku_num = shopcar[Index].goods_sku_num + 1;
        this.setData({
          validCarts: shopcar,
          total: total,
        });
        this.getCartCount();
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
        })
      });
  },

  decrementQuantity(e) {
    let Index = e.currentTarget.dataset.index, //点击的商品下标值        
      shopcar = this.data.validCarts,
      total = this.data.total; //总计  
    if (shopcar[Index].goods_sku_num === 1) {
      var _this = this;
      wx.showModal({
        title: '删除商品',
        content: '确定要删除该商品吗？',
        confirmColor: '#11A24A',
        success(res) {
          if (res.confirm) {
            _this.deleteCart(shopcar[Index].goods_sku_id)
            shopcar[Index].check && (total -= +shopcar[Index].price); //如果商品为选中的，则合计价格-商品单价   
            total = Number(total.toFixed(2));
            console.log(total, 'ffff');
            _this.setData({
              total: total,
            });
          } else if (res.cancel) {}
        }
      })
    } else {
      CartService.updateCart(shopcar[Index].goods_sku_id, shopcar[Index].goods_sku_num - 1)
        .then((res) => {
          shopcar[Index].goods_sku_num = shopcar[Index].goods_sku_num - 1;
          shopcar[Index].check && (total -= +shopcar[Index].price); //如果商品为选中的，则合计价格-商品单价   
          total = Number(total.toFixed(2));
          this.setData({
            validCarts: shopcar,
            total: total,
          });
          this.getCartCount();
        })
        .catch((error) => {
          wx.showToast({
            title: error.data.message,
          })
        });
    }

  },

  // 删除购物车
  deleteCart(skuId) {
    CartService.deleteCart(skuId)
      .then((res) => {
        this.data.validCarts.forEach((item, index) => {
          if (skuId === item.goods_sku_id) {
            this.data.validCarts.splice(index, 1);
          }
          this.getCartCount();
          this.setData({
            validCarts: this.data.validCarts,
          });
        })
        wx.showToast({
          title: res.data.data.message,
        })
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
        })
      })
  },

  // 获取购物车数量
  getCartCount() {
    CartService.getCartCount()
      .then((res) => {
        wx.setStorageSync('cartNum', res.data.data);
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
        this.getAllCarts();
      })
      .catch(() => { });
  },

  // 猜你喜欢
  getLikeList() {
    wx.showLoading({
      title: '',
      icon: 'Loading'
    })
    CartService.getLikeList()
      .then((res) => {
        wx.hideLoading();
        this.data.guessList = res.data.data
        this.setData({
          guessList: this.data.guessList,
        })
      })
      .catch((error) => {
        wx.showToast({
          title: '',
          icon: 'none',
        })
      })
  },

  //判断是否为全选  
  judgmentAll() {
    let shopcar = this.data.validCarts,
      shoplen = shopcar.length,
      lenIndex = 0; //选中的物品的个数    
    for (let i = 0; i < shoplen; i++) { //计算购物车选中的商品的个数    
      shopcar[i].check && lenIndex++;
    }
    this.setData({
      allsel: lenIndex == shoplen //如果购物车选中的个数和购物车里货物的总数相同，则为全选，反之为未全选    
    });
    console.log(this.data.selarr, 'judgmentAll')
  },
  onLoad: function(options) {

  },
  onReady: function() {

  },

  getAllCarts() {
    CartService.getAllCarts()
      .then((res) => {
        this.getCartCount();
        if (res.data.data.valid_carts.length === 0) {
          this.getLikeList();
        } else {
          this.data.validCarts = res.data.data.valid_carts;
          this.data.selarr = [];
          console.log(this.data.validCarts, 'res');
          console.log(this.data.selarr, 'getAllCarts')
          var total = 0;
          var selarr = this.data.selarr;
          for (let i = 0, len = this.data.validCarts.length; i < len; i++) { //这里是对选中的商品的价格进行总结    
            if (this.data.validCarts[i].check) {
              total += this.data.validCarts[i].goods_sku_num * this.data.validCarts[i].price;
              selarr.push(this.data.validCarts[i]);
            }
          }
          this.setData({
            validCarts: this.data.validCarts,
            total: total,
            selarr: selarr
          });
          this.judgmentAll(); //判断是否全选  
        }
      })
      .catch((error) => {

      })
  },
  /**   * 生命周期函数--监听页面显示   */
  onShow() {
    // var shopcarData = [{ //购物车   
    //   id: '1',
    //   name: '折后i啊手动阀就是点击发送的金佛啊是是假的佛山折后i啊手动阀就是点击发送的金佛啊是是假的佛山',
    //   price: '230',
    //   num: 1,
    //   types: '白色/39码',
    //   check: true
    // }, {
    //   id: '2',
    //   name: '啊哈额和福特好热惊讶所以就如同撒打发士大夫',
    //   price: '332',
    //   num: 1,
    //   types: '粉色/38码'
    // }, {
    //   id: '3',
    //   name: '啊如何呀还是大范围推广哇额饿啊日hers的说法的事发生的',
    //   price: '120',
    //   num: 1,
    //   types: '白色/41码',
    //   check: true
    // }];
    this.getAllCarts();
  }
})