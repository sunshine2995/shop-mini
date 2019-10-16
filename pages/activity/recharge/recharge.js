import * as OrderService from '../../../services/OrderService';
import * as GiftService from '../../../services/GiftService';
import * as UserService from '../../../services/UserService';
import * as RouterUtil from '../../../utils/RouterUtil';

const app = getApp();

Page({
  data: {
    winHeight: '', //窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    rechargeImg: [], //充值图片
    isShowCurtain: false, // 遮罩层
    paymentType: 1, // 支付方式
    totalAmount: 0, // 充值金额
    rechargeTypeId: 4, //充值金额的Id
    giftId: 0, // 赠礼Id
    giftList: [], // 赠礼列表
    isShowCurtain: false, // 遮罩层
    isShowMobile: false, // 是否展示绑定手机号的遮罩
    phoneNum: '', // 用户手机号
    share_id: 0, // 正在进行的任务的id,
    userId: 0, // 用户id,
  },

  getTipMobile() {
    this.setData({
      isShowCurtain: true,
      isShowMobile: true,
    });
  },

  getExplain() {
    this.setData({
      isShowCurtain: true,
      isShowMobile: false,
    });
  },

  bindPhone() {
    this.getUser();
    this.setData({
      isShowCurtain: false,
      isShowMobile: false,
    });
  },

  getUser() {
    UserService.getUser()
      .then((res) => {
        this.data.userId = res.data.data.id;
        this.setData({
          phoneNum: res.data.data.phone,
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

  checkboxChange(e) {
    this.data.paymentType = Number(e.detail.value);
  },

  getRechargeGift() {
    GiftService.getRechargeGift(this.data.rechargeTypeId)
      .then((res) => {
        this.data.giftList = res.data.data;
        if (this.data.giftList.length) {
          this.data.giftId = this.data.giftList[0].id;
        } else {
          this.data.giftId = 0;
        }
        this.data.giftList.forEach((item, index) => {
          if (index === 0) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        });
        this.setData({
          giftList: this.data.giftList,
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

  submitRechargeOrder() {
    if (!this.data.phoneNum) {
      this.setData({
        isShowCurtain: true,
        isShowMobile: true,
      });
    } else if (!this.data.paymentType) {
      wx.showToast({
        title: '未勾选支付方式',
        icon: 'none',
        duration: 2000,
      });
    } else if (!app.globalData.userInfo) {
      RouterUtil.go('/pages/index/index');
    } else {
      OrderService.submitRechargeShare(
        1,
        this.data.totalAmount,
        this.data.rechargeTypeId,
        this.data.giftId,
        this.data.share_id,
        this.data.userId,
      )
        .then((res) => {
          const orderNo = res.data.data.orderNo;
          this.WxPay(orderNo);
        })
        .catch((error) => {
          wx.showToast({
            title: error.data.message,
            icon: 'none',
            duration: 2000,
          });
        });
    }
  },

  WxPay(orderNo) {
    OrderService.WxPay(orderNo)
      .then((res) => {
        const data = res.data.data;
        wx.requestPayment({
          timeStamp: data.timestamp,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: data.signType,
          paySign: data.paySign,
          success: function(res) {
            RouterUtil.go('/pages/user/user');
          },
          fail: function(res) {},
          complete: function(res) {},
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

  getRechargeList() {
    OrderService.getRechargeList()
      .then((res) => {
        res.data.data.forEach((item, index) => {
          if (+item.id === +this.data.rechargeTypeId) {
            this.data.currentTab = index;
            this.data.totalAmount = item.recharge_amount;
          }
          this.data.rechargeImg.push({
            img: item.img_url,
            name: item.name,
            id: item.id,
            money: item.recharge_amount,
          });
        });
        this.setData({
          rechargeImg: this.data.rechargeImg,
          currentTab: this.data.currentTab,
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
  // 滚动切换标签样式
  switchTab(e) {
    const index = e.detail.current;
    this.data.totalAmount = this.data.rechargeImg[index].money;
    this.data.rechargeTypeId = this.data.rechargeImg[index].id;
    this.getRechargeGift();
    this.setData({
      currentTab: index,
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function(e) {
    const cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur,
      });
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function() {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300,
      });
    } else {
      this.setData({
        scrollLeft: 0,
      });
    }
  },

  hideCurtain() {
    this.data.isShowCurtain = false;
    this.setData({
      isShowCurtain: this.data.isShowCurtain,
    });
  },

  onLoad(option) {
    if (+option.rechargeId) {
      this.data.rechargeTypeId = +option.rechargeId;
    }
    if (+option.shareId) {
      this.data.share_id = +option.shareId;
      console.log('share_id', this.data.share_id);
    }
    this.getUser();
    this.getRechargeGift();
    this.getRechargeList();

    wx.getSystemInfo({
      success: (res) => {
        const clientHeight = res.windowHeight;
        const clientWidth = res.windowWidth;
        const rpxR = 750 / clientWidth;
        const calc = clientHeight * rpxR - 180;
        this.setData({
          winHeight: calc,
        });
      },
    });
  },
  footerTap: app.footerTap,
});