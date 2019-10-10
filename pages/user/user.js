import * as UserService from '../../services/UserService';
import * as OrderService from '../../services/OrderService';
import * as RouterUtil from '../../utils/RouterUtil';

var app = getApp();

Page({
  data: {
    rechargeImg: [], //充值图片
    statusNumList: {}, // 不同状态订单数量
    isShowCurtain: false, // 遮罩层
    authUserInfo: {}, // 授权信息
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
    this.getUserInfo();
    this.setData({
      isShowCurtain: false,
    });
  },

  onShow: function() {
    if (app.globalData.userInfo) {
      this.setData({
        authUserInfo: app.globalData.userInfo,
      });
    }
    console.log(this.data.authUserInfo, 'userInfo');
    this.getUserInfo();
    this.getUser();
    this.getRechargeList();
    this.getStatusNum();
    wx.showLoading({
      title: '',
    });
  },

  getStatusNum() {
    wx.showLoading({
      title: '加载中',
    });
    OrderService.getStatusNum()
      .then((res) => {
        wx.hideLoading();
        this.data.statusNumList = res.data.data;
        this.setData({
          statusNumList: this.data.statusNumList,
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

  orderList(e) {
    const status = e.currentTarget.dataset.status;
    RouterUtil.go(`/pages/order/list/list?status=${status}`);
  },

  toRecharge(e) {
    const rechargeId = e.currentTarget.dataset.rechargeId;
    RouterUtil.go(`/pages/recharge/recharge?rechargeId=${rechargeId}`);
  },

  getRechargeList() {
    OrderService.getRechargeList()
      .then((res) => {
        this.data.rechargeImg = [];
        res.data.data.forEach((item) => {
          this.data.rechargeImg.push({ img: item.img_url, name: item.name, id: item.id, money: item.recharge_amount });
        });
        this.setData({
          rechargeImg: this.data.rechargeImg,
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
        app.globalData.userData = res.data.data;
        this.getShopInfo();
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000,
        });
      });
  },

  goToAuthorize() {
    RouterUtil.go('/pages/index/index');
  },

  getUserInfo() {
    UserService.getUserInfo()
      .then((res) => {
        wx.hideLoading();
        var userInfo = res.data.data;
        this.setData({
          userInfo: userInfo,
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

  getShopInfo() {
    UserService.getShopInfo(app.globalData.userData.current_subbranch_id)
      .then((res) => {
        app.globalData.shopInfo = res.data.data;
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000,
        });
      });
  },
});
