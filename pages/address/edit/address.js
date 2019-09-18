// pages/address/add/address.js
var amapFile = require('../../../libs/amap-wx.js');
var myAmapFun;
var key = require('../../../libs/config.js');
const throttle = require('../../../utils/util.js');
var AddressService = require('../../../utils/services/AddressService.js');

Page({
  data: {
    latitude: '', //纬度
    longitude: '', //经度
    key: key.Key,
    markers: [],
    options: [{
      value: 1,
      label: '先生',
      checked: false,
    }, {
      value: 2,
      label: '女士',
      checked: true,
    }],

    region: ['单击选择地址', '', ''],
    // customItem: '全部',

    typeOptions: [{
        value: 1,
        text: '家',
      },
      {
        value: 2,
        text: '单位',
      },
      {
        value: 3,
        text: '朋友家',
      },
      {
        value: 4,
        text: '父母家',
      },
      {
        value: 5,
        text: '其他',
      },
    ],
    active: 0,
    defaultCheck: true,
    address: {
      id: 1,
      name: '',
      mobile: '',
      province: '',
      city: '',
      area: '',
      street: '',
      radioValue: 2, // 性别
      addressType: 1,
    },
  },

  // 监听textarea
  bindTextAreaChange: throttle.throttle(function(e) {
    console.log('bindTextAreaChange')
    var _this = this;
    _this.data.address.street = e[0].detail.value;
    _this.getLocationByAddress();
  }, 500),

  // 监听更改城市
  bindRegionChange(e) {
    console.log('bindRegionChange')
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.address.province = e.detail.value[0];
    this.data.address.city = e.detail.value[1];
    this.data.address.area = e.detail.value[2];
    console.log('picker发送选择改变，携带值为', this.data.address.province, this.data.address.city, this.data.address.area)
    this.getLocationByAddress();
    this.setData({
      region: e.detail.value,
      street: '',
    });
  },


  // 拖动地图
  regionchange(e) {
    let self = this;
    console.log(e,self.data.latitude, self.data.longitude,  'ffffffffffff')
    self.mapCtx = wx.createMapContext("map");
    if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
      self.mapCtx.getCenterLocation({
        success: function(res) {
          if (res.latitude && res.longitude) {
            self.data.latitude = res.latitude;
            self.data.longitude = res.longitude;
          }
          console.log(self.data.latitude, self.data.longitude, 'jjjjjjjjjj')
          // self.data.markers = [{
          //   id: 0,
          //   longitude: res.longitude,
          //   latitude: res.latitude,
          //   title: res.address,
          //   iconPath: '../../../images/home/user.png',
          //   width: 32,
          //   height: 32
          // }]
          self.setData({
            // markers: self.data.markers,
            latitude: self.data.latitude,
            longitude: self.data.longitude,
          })
          wx.showLoading({
            title: '',
          })
          self.getAddressByLocation();
          if (!self.data.latitude || !self.data.longitude) {
            self.getLocationByAddress();
            console.log('getLocationByAddressgetLocationByAddressgetLocationByAddress')
          }
        }
      });
    }
  },

  // 经纬度转地址
  getAddressByLocation() {
    const location = `${this.data.longitude},${this.data.latitude}`;
    AddressService.getAddressByLocation(location)
      .then((res) => {
        wx.hideLoading();
        const _res = res.data.regeocode.addressComponent;
        this.data.address.province = _res.province;
        this.data.address.city = _res.city;
        this.data.address.area = _res.district;
        this.data.address.street = _res.township + _res.streetNumber.street;
        //成功回调
        [this.data.longitude, this.data.latitude] = String(_res.streetNumber.location).split(',')

        console.log(this.data.latitude, this.data.longitude, 'this.data.latitude')
        this.data.markers = [{
          id: 0,
          longitude: this.data.longitude,
          latitude: this.data.latitude,
          title: _res.formatted_address,
          iconPath: '../../../images/home/user.png',
          width: 32,
          height: 32
        }]
        this.setData({ //设置markers属性和地图位置poi，将结果在地图展示
          // markers: this.data.markers,
          latitude: this.data.latitude,
          longitude: this.data.longitude,
          street: this.data.address.street,
          region: [this.data.address.province, this.data.address.city, this.data.address.area],
        });

      })
      .catch((error) => {})
  },

  // 地址转经纬度
  getLocationByAddress() {
    wx.showLoading({
      title: '',
    })
    const address = `${this.data.address.province}${this.data.address.city}${this.data.address.area}${this.data.address.street}`;
    AddressService.getLocationByAddress(address)
      .then((res) => {
        wx.hideLoading();
        const _res = res.data.geocodes[0];
        //成功回调
        [this.data.longitude, this.data.latitude] = String(_res.location).split(',')

        console.log(res, this.data.latitude, this.data.longitude, 'this.data.latitude')

        this.setData({ //设置markers属性和地图位置poi，将结果在地图展示
          latitude: this.data.latitude,
          longitude: this.data.longitude,
        });

      })
      .catch((error) => {})
  },

  markertap(e) {
    console.log(e.markerId, 'markertap')
  },

  controltap(e) {
    console.log(e.controlId, 'controltap')
  },

  // 更改地址类型
  toggle(e) {
    const active = e.currentTarget.dataset.index;
    this.data.address.addressType = e.currentTarget.dataset.value;
    console.log(this.data.address.addressType);
    this.setData({
      active: active,
    })
  },

  // 是否为默认地址 
  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value, this.data.defaultCheck)
    if (e.detail.value == '默认') {
      this.data.defaultCheck = true;
    } else {
      this.data.defaultCheck = false;
    }

  },

  // 更换性别
  radioChange(e) {
    this.data.address.radioValue = +e.detail.value;
    this.data.options.forEach((item) => {
      if (+item.value === +e.detail.value) {
        item.checked = true;
      } else {
        item.checked = false;
      }
      this.setData({
        options: this.data.options,
      });
    });
  },

  // 表单内容
  saveAddress(e) {
    console.log(e);
    this.data.address.name = e.detail.value.consignee;
    this.data.address.mobile = e.detail.value.mobile;
    const address = {
      addressId: this.data.address.id,
      name: this.data.address.name,
      mobile: this.data.address.mobile,
      radioValue: this.data.address.radioValue,
      province: this.data.address.province,
      city: this.data.address.city,
      area: this.data.address.area,
      street: this.data.address.street,
      addressType: this.data.address.addressType,
      isDefault: this.data.defaultCheck,
      longi: this.data.longitude,
      lati: this.data.latitude,
    }
    if (this.data.address.name.replace(/\s/gi, '').length === 0) {
      wx.showToast({
        title: '请填写您的姓名',
        icon: 'none',
      })
    } else if (!this.data.address.mobile) {
      wx.showToast({
        title: '请填写您的电话号码',
        icon: 'none',
      })
    } else if (this.data.address.mobile.replace(/\s/gi, '').length !== 11) {
      wx.showToast({
        title: '请填写正确的电话号码',
        icon: 'none',
      })
    } else if (!this.data.address.province || !this.data.address.province || !this.data.address.province) {
      wx.showToast({
        title: '选择城市信息',
        icon: 'none',
      })
    } else if (!this.data.address.street.replace(/\s/gi, '')) {
      wx.showToast({
        title: '请填写具体地址',
        icon: 'none',
      })
    } else {
      AddressService.updateAddress(address)
        .then((res) => {
          wx.showToast({
            title: res.data.message,
          });
          wx.navigateBack({
            delta: 1
          })
        })
        .catch((error) => {
          wx.showToast({
            title: error.data.message,
            icon: 'none',
          })
        })
    }
  },

  getAddressInfo(addressId) {
    AddressService.getAddressInfo(this.data.address.id)
      .then((res) => {
        const addressInfo = res.data.data;
        this.data.address.name = addressInfo.buyer_name;
        this.data.address.mobile = addressInfo.buyer_phone;
        this.data.address.province = addressInfo.buyer_province;
        this.data.address.city = addressInfo.buyer_city;
        this.data.address.area = addressInfo.buyer_district;
        this.data.address.street = addressInfo.buyer_address;
        this.data.address.radioValue = addressInfo.sex;
        this.data.address.addressType = addressInfo.address_type;
        // this.data.latitude = addressInfo.latitude;
        // this.data.longitude = addressInfo.longitude;
        this.data.defaultCheck = addressInfo.is_default;
        this.data.options.forEach((item) => {
          if (+item.value === +this.data.address.radioValue) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        });
        this.data.typeOptions.forEach((item, index) => {
          if (+item.value === +this.data.address.addressType) {
            this.data.active = index;
          }
        });

        this.setData({
          name: this.data.address.name,
          mobile: this.data.address.mobile,
          region: [this.data.address.province, this.data.address.city, this.data.address.area, ],
          street: this.data.address.street,
          defaultCheck: this.data.defaultCheck,
          options: this.data.options,
          active: this.data.active,
          // latitude: this.data.latitude,
          // longitude: this.data.longitude,
        });
        this.getLocationByAddress();
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
        })
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.address.id = options.addressId;
    this.getAddressInfo()
    myAmapFun = new amapFile.AMapWX({
      key: this.data.key,
    });
    // myAmapFun.getRegeo({
    //   success: function(res) {
    //     wx.hideLoading();
    //     console.log(res, 'myAmapFun.getRegeo')
    //     self.data.address.province = res[0].regeocodeData.addressComponent.province;
    //     self.data.address.city = res[0].regeocodeData.addressComponent.city;
    //     self.data.address.area = res[0].regeocodeData.addressComponent.district;
    //     self.data.address.street = res[0].regeocodeData.addressComponent.township + res[0].regeocodeData.addressComponent.streetNumber.street;
    //     //成功回调
    //     [self.data.longitude, self.data.latitude] = String(res[0].regeocodeData.addressComponent.streetNumber.location).split(',')

    //     console.log(self.data.latitude, self.data.longitude, 'self.data.latitude')
    //     self.data.markers = [{
    //       id: 0,
    //       longitude: self.data.longitude,
    //       latitude: self.data.latitude,
    //       title: res.address,
    //       iconPath: '../../../images/home/user.png',
    //       width: 32,
    //       height: 32
    //     }]
    //     self.setData({ //设置markers属性和地图位置poi，将结果在地图展示
    //       markers: self.data.markers,
    //       latitude: self.data.latitude,
    //       longitude: self.data.longitude,
    //       street: self.data.address.street,
    //       region: [self.data.address.province, self.data.address.city, self.data.address.area],
    //     });
    //   },
    //   fail: function(info) {
    //     //失败回调
    //   }
    // });
    // AddressService.getLocationByAddress(address)
    //   .then((res) => {
    //     console.log(res);
    //   })
  },
  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function() {},

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