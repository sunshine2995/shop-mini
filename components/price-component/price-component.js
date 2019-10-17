//(Component构造器)
Component({
  //一些组件选项
  externalClasses: ['text-color', 'custom-template'],

  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  //组件的对外属性，属性设置中可包含三个字段,type 表示属性类型、 value 表示属性初始值、 observer 表示属性值被更改时的响应函数
  properties: {
    price: {
      type: String,
      value: '',
      observer: function(newVal, oldVal) {
        let first;
        let second = '';
        if (String(Number(newVal)).split('.').length > 1) {
          [first, second] = String(Number(newVal)).split('.');
        } else {
          [first] = String(Number(newVal)).split('.');
        }
        this.setData({
          first: first,
          second: second,
        });
      },
    },

    unit: {
      type: String,
      value: '',
    },

    priceDesc: {
      type: String,
      value: '',
    },

    coverUrl: {
      type: String,
      value: 'http://img.youpenglai.cn/meetingpic/0b24376c43b1c372076aa65253b2f0ca123.jpg',
    },

    activityTitle: {
      type: String,
      value: '我是Title',
    },
  },
  //组件的内部数据，和 properties 一同用于组件的模版渲染
  data: {
    isShowOrganizer: false,
    first: '',
    second: '',
  },
  //组件的方法，包括事件响应函数和任意的自定义方法
  methods: {
    // 跳转活动详情
    activityDetailTap: function(e) {},
  },
});
