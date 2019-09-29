//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    motto: '菜巴士·送菜到家',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    prevPage: '', // 上个页面的路径
  },
  //事件处理函数
  bindViewTap: function() {
    wx.switchTab({
      url: '../logs/logs',
    });
  },
  onLoad: function() {
    let pages = getCurrentPages(); //获取当前页面信息栈
    this.data.prevPage = pages[pages.length - 2].route; //获取上一个页面信息栈
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      });
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        });
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: (res) => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
          });
        },
      });
    }
  },

  // 登录
  login() {
    wx.login({
      success: (res) => {
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
            success: (res) => {
              const token = res.data.data.token;
              // console.log(token, 'fff');
              wx.setStorageSync('token', token);
              wx.switchTab({
                url: '../home/home',
              });
            },
          });
        }
      },
    });
  },

  getUserInfo: function(e) {
    if (e.detail.userInfo) {
      console.log('授权通过');
      app.globalData.userInfo = e.detail.userInfo;
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
      });
      // this.login();
    } else {
      console.log('拒绝授权');
      wx.showToast({
        title: '残忍地拒绝了授权',
        icon: 'none',
      });
    }
    const path = `/${this.data.prevPage}`;
    if (
      path === '/pages/home/home' ||
      path === '/pages/cart/cart' ||
      path === '/pages/sort/sort' ||
      path === '/pages/user/user'
    ) {
      wx.switchTab({
        url: path,
      });
    } else {
      wx.navigateTo({
        url: path,
      });
    }
  },
});
