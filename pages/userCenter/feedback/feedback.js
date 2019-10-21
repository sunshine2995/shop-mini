import * as UserService from '../../../services/UserService';
import * as RouterUtil from '../../../utils/RouterUtil';

Page({
  data: {
    tempFilePaths: [],
    imgList: [],
    noteMaxLen: 300, // 最多放多少字
    info: '',
    noteNowLen: 0, //备注当前字数
    feedback: {
      contact: '',
      content: '',
      img_url1: '',
      img_url2: '',
      img_url3: '',
      img_url4: '',
    },
  },
  // 监听字数
  bindTextAreaChange(e) {
    const value = e.detail.value;
    this.data.feedback.content = e.detail.value;
    const len = parseInt(value.length);
    if (len > this.data.noteMaxLen) return;
    this.setData({
      info: value,
      noteNowLen: len,
    });
  },

  bindKeyInput(e) {
    this.data.feedback.contact = e.detail.value;
  },

  /**
   * 上传图片方法
   */
  addFeedback() {
    this.data.feedback = Object.assign({}, this.data.feedback, {
      content: this.data.feedback.content,
      contact: this.data.feedback.contact,
    });
    if (!this.data.feedback.content) {
      wx.showToast({
        title: '未填写反馈建议',
        icon: 'none',
        duration: 2000,
      });
    } else {
      UserService.addFeedback(this.data.feedback)
        .then((res) => {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000,
          });
          RouterUtil.go('/pages/user/user');
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

  upload() {
    let that = this;
    wx.chooseImage({
      count: 4, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 1000,
        });
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.data.tempFilePaths = that.data.tempFilePaths.concat(res.tempFilePaths);
        that.setData({
          tempFilePaths: that.data.tempFilePaths,
        });
        /**
         * 上传完成后把文件上传到服务器
         */
        let count = 0;
        this.data.imgList = [];
        for (let i = 0, h = that.data.tempFilePaths.length; i < h; i++) {
          //上传文件
          wx.uploadFile({
            url: 'https://upload.caibashi.com/uploads/',
            filePath: that.data.tempFilePaths[i],
            name: 'file',
            header: {
              'Content-Type': 'multipart/form-data',
            },
            success(res) {
              if (res.statusCode === 406) {
                wx.showToast({
                  title: JSON.parse(res.data).message,
                  icon: 'loading',
                  mask: true,
                  duration: 2000,
                });
              } else if (res.statusCode === 200) {
                wx.showToast({
                  title: '上传成功',
                  icon: 'loading',
                  mask: true,
                  duration: 2000,
                });
                count++;
                that.data.imgList.push(JSON.parse(res.data).url);
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
                  contact: that.data.feedback.contact,
                });

                //如果是最后一张,则隐藏等待中
                if (count == that.data.tempFilePaths.length) {
                  wx.hideToast();
                }
              }
            },
            fail: () => {
              wx.showToast({
                title: '上传失败',
                icon: 'loading',
                mask: true,
                duration: 3000,
              });
            },
          });
        }
      },
    });
  },

  /**
   * 预览图片方法
   */
  listenerButtonPreviewImage(e) {
    const index = e.target.dataset.index;

    wx.previewImage({
      current: this.data.tempFilePaths[index],
      urls: this.data.tempFilePaths,
    });
  },

  deleteImage(e) {
    const imgList = this.data.tempFilePaths;
    const index = e.currentTarget.dataset.index;
    imgList.splice(index, 1);
    this.setData({
      tempFilePaths: imgList,
    });
  },

  onLoad() {
    this.data.tempFilePaths = [];
  },
});
