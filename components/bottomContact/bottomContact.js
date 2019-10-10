import * as RouterUtil from '../../utils/RouterUtil';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    phoneNumber: {
      type: String,
      value: '',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    freeTell() {
      if (this.properties.phoneNumber) {
        wx.makePhoneCall({
          phoneNumber: this.properties.phoneNumber,
        });
      } else {
        wx.showToast({
          title: '店长没有设置电话',
          icon: 'none',
          duration: 2000,
        });
      }
    },
    goOnline() {
      RouterUtil.go('/pages/userCenter/customerService/customerService');
    },
  },
});
