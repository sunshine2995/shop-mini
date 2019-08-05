// pages/goodsSearch/goodsSearch.js
var GoodsService = require('../../utils/services/GoodsService.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showClear: false, // 清除图标展示与否
    inputVal: "",
    showHistory: true, // 历史列表展示与否
    showSpuName: false, // 搜索商品名称展示与否
    HistoryList: [],
    HotList: [],
    goodsList: [],
    goodsDetailList: [],
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.goodId;
    wx.navigateTo({
      url: `/pages/goodsDetail/goodsDetail?goodId=${id}`,
    })
  },

  bindKeyInput(e) {
    this.data.inputVal = e.detail.value;
    if (this.data.inputVal.trim() === '') {
      this.data.goodsList = [];
      this.data.goodsDetailList = [];
      this.data.showHistory = true;
    } else {
      this.data.showHistory = false;
      this.fuzzySearchGoodsIdName();
    }
    this.setData({
      showHistory: this.data.showHistory,
      inputVal: this.data.inputVal,
    });
  },

  bindconfirm(e) {
    this.data.inputVal = e.detail.value;
    this.fuzzySearchGoodsSpu()
  },

  getHistoryList() {
    if (this.data.inputVal !== '') {
      if (this.data.HistoryList.length > 0) {
        // 有数据的话 判断
        if (this.data.HistoryList.indexOf(this.data.inputVal) !== -1) {
          // 有相同的，先删除 再添加
          this.data.HistoryList.splice(this.data.HistoryList.indexOf(this.data.inputVal), 1);
          this.data.HistoryList.unshift(this.data.inputVal);
        } else {
          // 没有相同的 添加
          this.data.HistoryList.unshift(this.data.inputVal);
        }
      } else {
        // 没有数据 添加
        this.data.HistoryList.unshift(this.data.inputVal);
      }
    }
    if (this.data.HistoryList.length > 6) {
      // 保留六个值
      this.data.HistoryList.pop();
    }
    this.setData({
      HistoryList: this.data.HistoryList,
    });
    wx.setStorageSync('historyList', this.data.HistoryList);
  },

  // 商品名列表
  fuzzySearchGoodsIdName() {
    GoodsService.fuzzySearchGoodsIdName(this.data.inputVal)
      .then((res) => {
        var goodsList = res.data.data;
        this.data.showSpuName = true;
        this.setData({
          goodsList: goodsList,
          showSpuName: this.data.showSpuName,
        });
      })
      .catch((res) => {})
  },

  // 商品详情
  fuzzySearchGoodsSpu() {
    GoodsService.fuzzySearchGoodsSpu(this.data.inputVal)
      .then((res) => {
        this.getHistoryList();
        var goodsDetailList = res.data.data;
        this.setData({
          goodsDetailList: goodsDetailList,
          showSpuName: false,
        });
      })
      .catch((res) => {})
  },

  chooseSearchResultAction(e) {
  },

  exchangeVal(e) {
    this.data.inputVal = e.currentTarget.dataset.newVal;
    this.setData({
      inputVal: this.data.inputVal,
      showHistory: false,
    });
    this.fuzzySearchGoodsIdName();
  },


  clearInput() {
    this.setData({
      inputVal: "",
      showHistory: true,
    });
  },

  getHotSearch() {
    GoodsService.getHotSearch()
      .then((res) => {
        this.data.HotList = res.data.data;
        this.setData({
          HistoryList: this.data.HistoryList,
          HotList: this.data.HotList,
        });
      })
      .catch(() => {});
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.data.HistoryList = wx.getStorageSync('historyList') || [];
    this.getHotSearch();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})