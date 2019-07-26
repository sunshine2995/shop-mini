"use strict";
var UserService = require('../../utils/services/UseService.js');
Page({
  data: {
    UserInfo: [],
  },
  bindViewTap: function(event) {
    const url = event.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },
  onLoad: function() {
    wx.showLoading({
      title: '加载中',
    })
    var inviteImages = [{
      img: "https://img.caibashi.com/07ec9d284b2577a064698ce483f7a3aa.png",
      url: '/pages/index/index',
    }, {
      img: "https://img.caibashi.com/afe8aeac4d6a26f65542dac87272c6d6.png",
        url: '/pages/index/index',
    }]

    var images = [{
      img: "https://img.caibashi.com/8c4ab7f7ee0fbb5a8b9413a9e1ddac27.png",
      url: '/pages/index/index',
    }, {
      img: "https://img.caibashi.com/0f276789b03f793bdf076d3d49e474e3.png",
        url: '/pages/index/index',
    }]

    this.setData({
      images: images,
      inviteImages: inviteImages,
    });
    this.getSortList();
    this.getCustom();
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

  getCustom() {
    UserService.getCustom()
      .then((res) => {
        wx.hideLoading();
        // wx.showToast({
        //   title: res.data.message,
        //   icon: 'none',
        //   duration: 2000
        // })
        var customImg = res.data.data.phoneIndexImage;
        this.setData({
          customImg: customImg,
        });
      })
      .catch(() => {

      })
  }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhvbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUksQ0FBQztJQUNELElBQUksRUFBQztRQUNELFFBQVEsRUFBRSxFQUFRO0tBQ3JCO0lBQ0QsTUFBTTtRQUNGLEVBQUUsQ0FBQyxXQUFXLENBQUM7WUFDWCxPQUFPLEVBQUUsVUFBQSxHQUFHO2dCQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDcEIsQ0FBQztTQUNKLENBQUMsQ0FBQTtJQUNOLENBQUM7Q0FDSixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJQYWdlKHtcclxuICAgIGRhdGE6e1xyXG4gICAgICAgIFVzZXJJbmZvOiBbXSBhcyBbXVxyXG4gICAgfSxcclxuICAgIG9ubG9hZCgpIHtcclxuICAgICAgICB3eC5nZXRVc2VySW5mbyh7XHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufSkiXX0=