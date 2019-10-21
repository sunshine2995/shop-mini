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
        this.getShopList();
      },
    });
  },
});
