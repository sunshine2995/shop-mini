class Dep {
  constructor() {
    this.subs = [];
  }

  addSubs(watcher) {
    this.subs.push(watcher);
  }

  notify() {
    this.subs.forEach((watcher) => {
      watcher.update();
    });
  }
}

class Watcher {
  constructor(key, gd, fn) {
    this.key = key;
    this.gd = gd;
    this.fn = fn;
    Dep.target = this;
    let arr = key.split('.');
    let val = this.gd;
    arr.forEach((key) => {
      val = val[key];
    });
    Dep.target = undefined;
  }

  update() {
    let arr = this.key.split('.');
    let val = this.gd;
    arr.forEach((key) => {
      val = val[key];
    });
    this.fn(val);
  }
}

App({
  globalData: {
    store: {
      cartNum: 0,
    },
    userInfo: null,
    userData: {},
    shopInfo: {},
    deliveryEnd: '',
    chooseGiftId: 0,
    chooseAddress: 0,
    sortOneId: 0,
    scene: 1036,
  },

  observe(data) {
    if (!data || typeof data !== 'object') {
      return;
    }
    this.Observe(data);
  },

  Observe(data) {
    let _this = this;
    for (let key in data) {
      let val = data[key];
      this.observe(data[key]);
      let dep = new Dep();
      Object.defineProperty(data, key, {
        configurable: true,
        get() {
          Dep.target && dep.addSubs(Dep.target);
          return val;
        },
        set(newValue) {
          if (val === newValue) {
            return;
          }
          val = newValue;
          _this.observe(newValue);
          dep.notify();

          // persist
          wx.setStorageSync(key, newValue);
        },
      });
    }
  },

  scanCart(cartNum) {
    //购物车数量都缓存，取名cart,任何一项修改购物车的行为，都会先取购物车的缓存，在重新更新缓存里的购物车参数
    if (+cartNum > 0) {
      wx.setTabBarBadge({
        index: 2,
        text: '' + cartNum + '',
      });
    } else {
      wx.removeTabBarBadge({
        index: 2,
      });
    }
  },

  makeWatcher(key, gb, fn) {
    new Watcher(key, gb, fn);
  },

  onLaunch(object) {
    this.globalData.scene = object.scene;
    console.log(`this.globalData.scene:${this.globalData.scene}`);
    this.observe(this.globalData.store);
    this.scanCart();
    this.makeWatcher('store.cartNum', this.globalData, (newValue) => {
      this.scanCart(newValue);
    });

    const cartNum = wx.getStorageSync('cartNum');
    this.globalData.store.cartNum = cartNum;

    // 获取用户信息
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: (res) => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            },
          });
        }
      },
    });
  },
});
