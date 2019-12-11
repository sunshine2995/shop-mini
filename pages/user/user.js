import * as UserService from '../../services/UserService';
import * as OrderService from '../../services/OrderService';
import * as RouterUtil from '../../utils/RouterUtil';

const app = getApp();

Page({
  data: {
    rechargeImg: [], //充值图片
    statusNumList: {}, // 不同状态订单数量
    isShowCurtain: false, // 遮罩层
    showAllInfo: false, // 未授权是否展示信息
    authUserInfo: {}, // 授权信息
    ani: '', //动画
    rewardMoney: 0, // 奖励金金额
    ifCash: false,
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
  startAnimation() {
    const animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: 0,
    });
    let next = false;
    setInterval(() => {
      if (next) {
        animation.scale(1.25).step();
        next = !next;
      } else {
        animation.scale(1.0).step();
        next = !next;
      }
      this.setData({
        ani: animation.export(),
      });
    }, 500);
  },

  onShow() {
    if (app.globalData.userInfo) {
      this.setData({
        authUserInfo: app.globalData.userInfo,
        showAllInfo: true,
      });
    }
    this.getUserInfo();
    this.getUser();
    this.getRechargeList();
    this.getStatusNum();
    this.startAnimation();
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
        this.data.rewardMoney = +res.data.data.reward_money;
        this.data.ifCash = res.data.data.rewarded;
        this.setData({
          rewardMoney: this.data.rewardMoney,
          ifCash: this.data.ifCash,
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

  goToAuthorize() {
    RouterUtil.go('/pages/index/index');
  },

  getUserInfo() {
    UserService.getUserInfo()
      .then((res) => {
        wx.hideLoading();
        const userInfo = res.data.data;
        this.setData({
          userInfo,
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
