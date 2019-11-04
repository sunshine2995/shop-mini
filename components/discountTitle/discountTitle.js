//(Component构造器)
Component({
  externalClasses: ['discount-time', 'discount-rebate'],
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },

  properties: {
    rebate: {
      type: String,
      value: '',
    },

    time: {
      type: String,
      value: '',
    },
  },

  data: {},

  methods: {},

  ready() {},
});
