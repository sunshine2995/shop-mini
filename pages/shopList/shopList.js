import * as AddressService from '../../services/AddressService.js';
import * as RouterUtil from '../../utils/RouterUtil';

const app = getApp();

Page({
  data: {
    shopList: [], // 店铺列表
  },

  getShopListByLocation(longitude, latitude) {
    wx.showLoading({
      title: '加载中',
    });
    AddressService.getShopListByLocation(longitude, latitude)
      .then((res) => {
        res.data.data.forEach((item) => {
          wx.hideLoading();
          item.showMask = item.id !== app.globalData.shopInfo.id;
        });
        this.setData({
          shopList: res.data.data,
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

  getShopList() {
    wx.showLoading({
      title: '加载中',
    });
    AddressService.getShopList()
      .then((res) => {
        wx.hideLoading();
        res.data.data.forEach((item) => {
          item.showMask = app.globalData.shopInfo.id !== item.id;
        });
        this.setData({
          shopList: res.data.data,
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

  changeShop(e) {
    const shopId = e.currentTarget.dataset.shopId;
    this.data.shopList.forEach((item) => {
      item.showMask = +item.id !== +shopId;
    });
    this.setData({
      shopList: this.data.shopList,
    });
    AddressService.changeShop(shopId)
      .then(() => {
        RouterUtil.go('/pages/home/home');
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000,
        });
      });
  },

  onShow() {
    wx.getLocation({
      type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      success: (res) => {
        const latitude = res.latitude;
        const longitude = res.longitude;
        this.getShopListByLocation(longitude, latitude);
      },
      fail: () => {
        wx.showModal({
          title: '',
          content: '检测到您未打开地理位置权限，是否前往开启',
          confirmText: '前往开启',
          cancelText: '暂不开启',
          confirmColor: '#11A24A',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting({
                //打开设置页
                success(res) {
                  //成功，返回页面回调
                  //如果同意了位置授权则userLocation=true
                  if (res.authSetting['scope.userLocation']) {
                    // 业务逻辑
                  }
                },
              });
            } else if (res.cancel) {
              this.getShopList();
            }
          },
        });
      },
    });
  },
});
