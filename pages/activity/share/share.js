import * as GiftService from '../../../services/GiftService';

Page({
  data: {
    shareList: [], // 未完成任务
    finishShareList: [], // 已完成任务列表
    share_id: 0, // 正在进行的任务的id,
  },

  getShareTip() {
    wx.showModal({
      title: '暂无进行中的任务',
      content: '创建任务？',
      confirmColor: '#11A24A',
      success: (res) => {
        if (res.confirm) {
          this.createTask();
        }
      },
    });
  },

  getShareTask() {
    wx.showLoading({
      title: '',
    });
    GiftService.getShareTask()
      .then((res) => {
        wx.hideLoading();
        this.data.finishShareList = res.data.data.finished_share_recharge_list;
        this.data.shareList = res.data.data.not_finished_share_recharge_list;
        if (this.data.shareList.length) {
          this.data.share_id = this.data.shareList[0].id;
        }
        this.setData({
          finishShareList: this.data.finishShareList,
          shareList: this.data.shareList,
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

  createTask() {
    wx.showLoading({
      title: '',
    });
    GiftService.createTask()
      .then((res) => {
        wx.hideLoading();
        wx.showToast({
          title: '创建成功',
          icon: 'none',
          duration: 2000,
        });
        this.getShareTask();
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000,
        });
      });
  },

  receiveReward(e) {
    const taskId = e.currentTarget.dataset.taskId;
    GiftService.receiveReward(taskId)
      .then((res) => {
        wx.showToast({
          title: '创建成功',
          icon: 'none',
          duration: 2000,
        });
        this.getShareTask();
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
          icon: 'none',
          duration: 2000,
        });
      });
  },

  onShow: function() {
    // this.getShareTask();
  },
  onLoad(options) {
    if (options.share_id) {
      wx.showToast({
        title: `options.share_id${options.share_id}`,
        icon: 'none',
        duration: 20000,
      });
      this.getShareTask();
    }
  },

  onShareAppMessage: function(res) {
    const url = encodeURIComponent('/pages/activity/share/share?share_id=' + this.data.share_id);
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target, 'share');
    }
    return {
      title: '分享三人次好友充值即可免费领取羊腿～',
      // path: `/pages/home/home?url=${url}`,
      path: '/pages/activity/share/share?share_id=' + this.data.share_id,
    };
  },
});
