Page({
  data: {
    SDKVersion: '', // 客户端基础库版本
    version: '', // 微信版本号
  },
  onShow() {
    this.data.SDKVersion = wx.getSystemInfoSync().SDKVersion;
    this.data.version = wx.getSystemInfoSync().version;
    this.setData({
      SDKVersion: this.data.SDKVersion,
      version: this.data.version,
    });
  },
});
