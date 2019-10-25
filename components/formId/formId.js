Component({
  methods: {
    formSubmit(e) {
      if ('the formId is a mock one' != e.detail.formId) {
        let formids = wx.getStorageSync('formids') || [];
        formids.push(e.detail.formId);
        formids = [...new Set(formids)];
        wx.setStorage({ key: 'formids', data: formids });
      }
    },
  },
});
