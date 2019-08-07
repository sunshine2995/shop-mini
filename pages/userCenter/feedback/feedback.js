// pages/userCenter/feedback/feedback.js
const UserService = require('../../../utils/services/UseService.js');

Page({
  data: {
    tempFilePaths: [],
    imgList: [],
    noteMaxLen: 300, // 最多放多少字
    info: "",
    noteNowLen: 0, //备注当前字数
    feedback: {
      contact: "",
      content: "",
      img_url1: "",
      img_url2: "",
      img_url3: "",
      img_url4: "",
    }
  },
  // 监听字数
  bindTextAreaChange(e) {
    var value = e.detail.value;
    this.data.feedback.content = e.detail.value;
    var len = parseInt(value.length);
    if (len > this.data.noteMaxLen)
      return;
    this.setData({
      info: value,
      noteNowLen: len
    })
  },

  bindKeyInput(e) {
    this.data.feedback.contact = e.detail.value;
  },

  onLoad: function(options) {
    this.data.tempFilePaths = [];
  },
  /**
   * 上传图片方法
   */
  addFeedback() {
    this.data.feedback = Object.assign({}, this.data.feedback, {
      content: this.data.feedback.content,
      contact: this.data.feedback.contact
    });
    if (!this.data.feedback.content) {
      wx.showToast({
        title: '未填写反馈建议',
        icon: 'none',
        duration: 2000
      });
    } else {
      UserService.addFeedback(this.data.feedback)
        .then((res) => {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          });
          wx.switchTab({
            url: '/pages/user/user',
          })
        })
        .catch((error) => {
          wx.showToast({
            title: error.data.message,
            icon: 'none',
            duration: 2000
          });
        });
    }
  },

  upload: function() {
    let that = this;
    wx.chooseImage({
      count: 4, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 1000
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

        that.data.tempFilePaths = res.tempFilePaths.concat(that.data.tempFilePaths);
        console.log(that.data.tempFilePaths, 'fffff');
        that.setData({
          tempFilePaths: that.data.tempFilePaths
        })
        /**
         * 上传完成后把文件上传到服务器
         */
        var count = 0;
        for (var i = 0, h = that.data.tempFilePaths.length; i < h; i++) {
          //上传文件
          wx.uploadFile({
            url: 'https://upload.caibashi.com/uploads/',
            filePath: that.data.tempFilePaths[i],
            name: 'file',
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function(res) {
              count++;
              that.data.imgList.push(JSON.parse(res.data).url);
              console.log(that.data.imgList, JSON.parse(res.data).url, 'JSON.parse(res.data).url');
              const list = {
                img_url1: '',
                img_url2: '',
                img_url3: '',
                img_url4: '',
              };
              for (let i = 0; i < that.data.imgList.length; i++) {
                const index = i + 1;
                const key = `img_url${index}`;
                list[key] = that.data.imgList[i];
              }

              that.data.feedback = Object.assign({}, list, {
                content: that.data.feedback.content,
                contact: that.data.feedback.contact
              });

              console.log(that.data.imgList, that.data.feedback, 'ggg');
              //如果是最后一张,则隐藏等待中  
              if (count == that.data.tempFilePaths.length) {
                wx.hideToast();
              }
            },
            fail: function(res) {
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function(res) {}
              })
            }
          });

        }
      }
    })
  },
  /**
   * 预览图片方法
   */
  listenerButtonPreviewImage: function(e) {
    let index = e.target.dataset.index;
    let that = this;
    wx.previewImage({
      current: that.data.tempFilePaths[index],
      urls: that.data.tempFilePaths,
      success: function(res) {
        //console.log(res);
      },
      fail: function() {
        //console.log('fail')
      }
    })
  },

  deleteImage(e) {
    var that = this;
    var imgList = that.data.tempFilePaths;
    var index = e.currentTarget.dataset.index;
    console.log(e.currentTarget.dataset.index);
    imgList.splice(index, 1);
    that.setData({
      tempFilePaths: imgList,
    });
  },
})