//app.js
App({
  onLaunch: function () {
    var _this = this;
    //初始化购物车
    _this.timer = setInterval(function () {
      _this.scanCart(_this)
    }, 100);
    _this.scanCart(_this);

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              _this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (_this.userInfoReadyCallback) {
                _this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    _this.login();
  },
  globalData: {
    userInfo: null,
  },
  // 登录
  login() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.request({
            method: 'POST',
            url: 'https://sso.caibasi.com/wxapp/login',
            header: {
              // 'content-type': 'application/x-www-form-urlencoded',
            },
            data: {
              code: res.code,
            },
            success: res => {
              const token = res.data.data.token;
              // console.log(token, 'fff');
              wx.setStorageSync('token', token);
            }
          })
        }
      }
    })
  },
  scanCart(that) {
    //购物车数量都缓存，取名cart,任何一项修改购物车的行为，都会先取购物车的缓存，在重新更新缓存里的购物车参数
    const cart = wx.getStorageSync("cartNum");
    if (cart > 0) {
      wx.setTabBarBadge({
        index: 2,				
        text: "" + cart + ""
      })
    } else {
      wx.removeTabBarBadge({
        index: 2,
      })
    }
  },
})