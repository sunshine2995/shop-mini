import amapFile from '../../../libs/amap-wx';
import key from '../../../libs/config';
import * as AddressService from '../../../services/AddressService';
import * as validator from '../../../utils/validator';
import * as _ from '../../../libs/lodash';

Page({
  data: {
    latitude: '', //纬度
    longitude: '', //经度
    key: key.Key,
    markers: [],
    options: [
      {
        value: 1,
        label: '先生',
        checked: false,
      },
      {
        value: 2,
        label: '女士',
        checked: true,
      },
    ],

    region: ['单击选择地址', '', ''],

    typeOptions: [
      {
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
  bindTextAreaChange: _.throttle(function(e) {
    this.data.address.street = e[0].detail.value;
    this.getLocationByAddress();
  }, 500),

  // 监听更改城市
  bindRegionChange(e) {
    this.data.address.province = e.detail.value[0];
    this.data.address.city = e.detail.value[1];
    this.data.address.area = e.detail.value[2];
    this.getLocationByAddress();
    this.setData({
      region: e.detail.value,
      street: '',
    });
  },

  // 拖动地图
  regionchange(e) {
    this.mapCtx = wx.createMapContext('map');
    if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
      this.mapCtx.getCenterLocation({
        success: (res) => {
          if (res.latitude && res.longitude) {
            this.data.latitude = res.latitude;
            this.data.longitude = res.longitude;
          }
          this.setData({
            // markers: self.data.markers,
            latitude: this.data.latitude,
            longitude: this.data.longitude,
          });
          wx.showLoading({
            title: '',
          });
          this.getAddressByLocation();
          if (!this.data.latitude || !this.data.longitude) {
            this.getLocationByAddress();
          }
        },
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
        this.data.address.street = _res.township + _res.streetNumber.street + _res.streetNumber.number;
        //成功回调
        [this.data.longitude, this.data.latitude] = String(_res.streetNumber.location).split(',');
        this.data.markers = [
          {
            id: 0,
            longitude: this.data.longitude,
            latitude: this.data.latitude,
            title: _res.formatted_address,
            iconPath: '../../../images/home/user.png',
            width: 32,
            height: 32,
          },
        ];
        this.setData({
          //设置markers属性和地图位置poi，将结果在地图展示
          // markers: this.data.markers,
          latitude: this.data.latitude,
          longitude: this.data.longitude,
          street: this.data.address.street,
          region: [this.data.address.province, this.data.address.city, this.data.address.area],
        });
      })
      .catch(() => {});
  },

  // 地址转经纬度
  getLocationByAddress() {
    wx.showLoading({
      title: '',
    });
    const address = `${this.data.address.province}${this.data.address.city}${this.data.address.area}${this.data.address.street}`;
    AddressService.getLocationByAddress(address)
      .then((res) => {
        wx.hideLoading();
        const _res = res.data.geocodes[0];
        //成功回调
        [this.data.longitude, this.data.latitude] = String(_res.location).split(',');
        this.setData({
          //设置markers属性和地图位置poi，将结果在地图展示
          latitude: this.data.latitude,
          longitude: this.data.longitude,
        });
      })
      .catch(() => {});
  },

  // 更改地址类型
  toggle(e) {
    const active = e.currentTarget.dataset.index;
    this.data.address.addressType = e.currentTarget.dataset.value;
    this.setData({
      active,
    });
  },

  // 是否为默认地址
  checkboxChange(e) {
    this.data.defaultCheck = e.detail.value == '默认';
  },

  // 更换性别
  radioChange(e) {
    this.data.address.radioValue = +e.detail.value;
    this.data.options.forEach((item) => {
      item.checked = +item.value === +e.detail.value;
      this.setData({
        options: this.data.options,
      });
    });
  },

  // 表单内容
  saveAddress(e) {
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
    };

    if (validator.isBlank(this.data.address.name)) {
      wx.showToast({
        title: '请填写您的姓名',
        icon: 'none',
      });
    } else if (!this.data.address.mobile) {
      wx.showToast({
        title: '请填写您的电话号码',
        icon: 'none',
      });
    } else if (!validator.isPhoneNumber(this.data.address.mobile)) {
      wx.showToast({
        title: '请填写正确的电话号码',
        icon: 'none',
      });
    } else if (!this.data.address.province || !this.data.address.province || !this.data.address.province) {
      wx.showToast({
        title: '选择城市信息',
        icon: 'none',
      });
    } else if (validator.isBlank(this.data.address.street)) {
      wx.showToast({
        title: '请填写具体地址',
        icon: 'none',
      });
    } else {
      AddressService.updateAddress(address)
        .then((res) => {
          wx.showToast({
            title: res.data.message,
          });
          wx.navigateBack({
            delta: 1,
          });
        })
        .catch((error) => {
          wx.showToast({
            title: error.data.message,
            icon: 'none',
          });
        });
    }
  },

  getAddressInfo() {
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
        this.data.defaultCheck = addressInfo.is_default;
        this.data.options.forEach((item) => {
          item.checked = +item.value === +this.data.address.radioValue;
        });
        this.data.typeOptions.forEach((item, index) => {
          if (+item.value === +this.data.address.addressType) {
            this.data.active = index;
          }
        });

        this.setData({
          name: this.data.address.name,
          mobile: this.data.address.mobile,
          region: [this.data.address.province, this.data.address.city, this.data.address.area],
          street: this.data.address.street,
          defaultCheck: this.data.defaultCheck,
          options: this.data.options,
          active: this.data.active,
        });
        this.getLocationByAddress();
      })
      .catch((error) => {
        wx.showToast({
          title: error.data.message,
        });
      });
  },

  onLoad(options) {
    this.data.address.id = options.addressId;
    this.getAddressInfo();
    new amapFile.AMapWX({
      key: this.data.key,
    });
  },
});
