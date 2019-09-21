const wxRequest = require('../wxRequest.js');

const BaseUrl = 'https://sso.caibasi.com';
const key = 'abface6fd8aa4366a86bc27e2704fd86'; // web服务

// 新增地址
export function addAddress(address) {
  return wxRequest.wxPromise('POST', `${BaseUrl}/user/set_address`, {
    buyer_name: address.name,
    buyer_phone: address.mobile,
    sex: address.radioValue,
    buyer_province: address.province,
    buyer_city: address.city,
    buyer_district: address.area,
    buyer_address: address.street,
    address_type: address.addressType,
    is_default: address.isDefault,
    longitude: address.longi,
    latitude: address.lati,
  });
}

// 获取所有地址列表
export function getAddressList() {
  return wxRequest.wxPromise('GET', `${BaseUrl}/user/get_addresses`);
}

// 删除某个地址
export function removeAddress(addressId) {
  return wxRequest.wxPromise('POST', `${BaseUrl}/user/delete_address`, {
    address_id: addressId,
  });
}

// 获取某个地址信息
export function getAddressInfo(addressId) {
  return wxRequest.wxPromise('GET', `${BaseUrl}/user/get_address`, { addressId });
}

// 修改某个地址
export function updateAddress(address) {
  return wxRequest.wxPromise('POST', `${BaseUrl}/user/update_address`, {
    address_id: address.addressId,
    buyer_name: address.name,
    buyer_phone: address.mobile,
    sex: address.radioValue,
    buyer_province: address.province,
    buyer_city: address.city,
    buyer_district: address.area,
    buyer_address: address.street,
    address_type: address.addressType,
    is_default: address.isDefault,
    longitude: address.longi,
    latitude: address.lati,
  });
}

// 根据地址获取经纬度
export function getLocationByAddress(address) {
  return wxRequest.wxPromise('GET', `https://restapi.amap.com/v3/geocode/geo?address=${address}&key=${key}`);
}

// 根据经纬度获取地址
export function getAddressByLocation(location) {
  return wxRequest.wxPromise('GET', `https://restapi.amap.com/v3/geocode/regeo?location=${location}&key=${key}`);
}

// 获取默认地址
export function getDefaultAddress() {
  return wxRequest.wxPromise('GET', `${BaseUrl}/user/get_default_address`);
}

// 根据id获取地址
export function getAddress(addressId) {
  return wxRequest.wxPromise('GET', `${BaseUrl}/user/get_address?addressId=${addressId}`);
}

// 根据经纬度店铺列表
export function getShopListByLocation(longitude, latitude) {
  return wxRequest.wxPromise("GET", `${BaseUrl}/subbranch?longitude=${longitude}&latitude=${latitude}`);
}

// 直接获取店铺列表
export function getShopList() {
  return wxRequest.wxPromise("GET", `${BaseUrl}/subbranch`);
}

// 更换店铺
export function changeShop(subbranchId) {
  return wxRequest.wxPromise("POST", `${BaseUrl}/subbranch`, {
    current_subbranch_id: subbranchId,
  });
}

