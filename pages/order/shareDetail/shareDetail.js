import moment from '../../../libs/moment';
import * as OrderService from '../../../services/OrderService';
import * as UserService from '../../../services/UserService';
import * as AddressService from '../../../services/AddressService';
import * as RouterUtil from '../../../utils/RouterUtil';
Page({
  data: {
    userInfo: {}, // 分享人信息
    shareGood: [], // 分享的商品
    creatTime: '', // 订单创建时间
    recordNo: '',
    shopId: 0, // 当前分店id
    shareShopId: 0, // 分享订单的分店id
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.goodId;
    RouterUtil.go(`/pages/goodsDetail/goodsDetail?goodId=${id}`);
  },

  getUser() {
    UserService.getUser()
      .then((res) => {
        this.data.shopId = res.data.data.current_subbranch_id;
        this.getGoodsShare();
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000,
        });
      });
  },
  changeShop() {
    if (this.data.shopId !== this.data.shareShopId && this.data.shareShopId !== 0 && this.data.shopId !== 0) {
      AddressService.changeShop(this.data.shareShopId).then(() => {
        wx.showToast({
          title: '已切换到此商品所在分店',
          icon: 'none',
          duration: 2000,
        });
      });
    }
  },

  getGoodsShare() {
    if (this.data.recordNo) {
      OrderService.getGoodsShare(this.data.recordNo)
        .then((res) => {
          this.data.userInfo = res.data.data.user_info;
          this.data.shareShopId = this.data.userInfo.subbranch_id;
          this.data.creatTime = moment(this.data.userInfo.create_time).format('YYYY/MM/DD');
          this.data.shareGood = res.data.data.share_good;
          this.setData({
            userInfo: this.data.userInfo,
            shareGood: this.data.shareGood,
            creatTime: this.data.creatTime,
          });
          this.changeShop();
        })
        .catch((error) => {
          wx.showToast({
            title: error.data.message,
            icon: 'none',
          });
        });
    }
  },
  onLoad(options) {
    if (options.recordNo) {
      this.data.recordNo = options.recordNo;
    }
    this.getUser();
  },
});
