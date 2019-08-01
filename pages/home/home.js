"use strict";
var UserService = require('../../utils/services/UseService.js');
var GoodsService = require('../../utils/services/GoodsService.js');
const app = getApp()

Page({
  data: {
    UserInfo: [],
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.goodId;
    wx.navigateTo({
      url: `/pages/goodsDetail/goodsDetail?goodId=${id}`,
    })
  },

  bindViewTap: function(event) {
    const url = event.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },

  bindJumpPath: function(event) {
    const path = `/pages${event.currentTarget.dataset.path}${event.currentTarget.dataset.path}`;
    wx.navigateTo({
      url: path,
    })
  },

  goToDiscount() {
    wx.navigateTo({
      url: '/pages/goodsDiscount/goodsDiscount',
    })
  },

  onLoad: function() {
    wx.showLoading({
      title: '加载中',
    })
    var inviteImages = [{
      img: "https://img.caibashi.com/07ec9d284b2577a064698ce483f7a3aa.png",
      url: '/pages/test/test',
    }, {
      img: "https://img.caibashi.com/afe8aeac4d6a26f65542dac87272c6d6.png",
      url: '/pages/test/test',
    }]

    var images = [{
      img: "https://img.caibashi.com/8c4ab7f7ee0fbb5a8b9413a9e1ddac27.png",
      url: '/pages/test/test',
    }, {
      img: "https://img.caibashi.com/0f276789b03f793bdf076d3d49e474e3.png",
      url: '/pages/test/test',
    }]

    this.setData({
      images: images,
      inviteImages: inviteImages,
    });
    this.getSortList();
    this.getCustom();
    this.getMarketingAlltype();
    this.getCategoryOneAllGoods();
  },

  getSortList() {
    UserService.getSortList()
      .then((res) => {
        var sortTitle = res.data.data;
        this.setData({
          sortList: sortTitle,
        });
      })
      .catch(() => {

      })
  },

  getMarketingAlltype() {
    GoodsService.getMarketingAlltype()
      .then((res) => {
        var marketingTypeList = res.data.data;
        this.setData({
          marketingTypeList: marketingTypeList,
        });
      })
      .catch(() => {

      })
  },


  getCategoryOneAllGoods() {
    GoodsService.getCategoryOneAllGoods()
      .then((res) => {
        var categoryOneList = res.data.data;
        this.setData({
          categoryOneList: categoryOneList,
        });
      })
      .catch(() => {

      })
  },

  getCustom() {
    UserService.getCustom()
      .then((res) => {
        wx.hideLoading();
        var customImg = res.data.data.phone_index_image;
        var customPath = res.data.data.index_redirect_url;
        this.setData({
          customImg: customImg,
          customPath: customPath,
        });
      })
      .catch(() => {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      })
  }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhvbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUksQ0FBQztJQUNELElBQUksRUFBQztRQUNELFFBQVEsRUFBRSxFQUFRO0tBQ3JCO0lBQ0QsTUFBTTtRQUNGLEVBQUUsQ0FBQyxXQUFXLENBQUM7WUFDWCxPQUFPLEVBQUUsVUFBQSxHQUFHO2dCQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDcEIsQ0FBQztTQUNKLENBQUMsQ0FBQTtJQUNOLENBQUM7Q0FDSixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJQYWdlKHtcclxuICAgIGRhdGE6e1xyXG4gICAgICAgIFVzZXJJbmZvOiBbXSBhcyBbXVxyXG4gICAgfSxcclxuICAgIG9ubG9hZCgpIHtcclxuICAgICAgICB3eC5nZXRVc2VySW5mbyh7XHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufSkiXX0=