const http = require('./http');

const BaseUrl = http.BaseUrl;
const key = 'abface6fd8aa4366a86bc27e2704fd86'; // web服务

// 新增地址
export function addAddress(address) {
  return http.post(`${BaseUrl}/user/set_address`, {
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
  return http.get(`${BaseUrl}/user/get_addresses`);
}

// 删除某个地址
export function removeAddress(addressId) {
  return http.post(`${BaseUrl}/user/delete_address`, { address_id: addressId });
}

// 获取某个地址信息
export function getAddressInfo(addressId) {
  return http.get(`${BaseUrl}/user/get_address`, { addressId });
}

// 修改某个地址
export function updateAddress(address) {
  return http.post(`${BaseUrl}/user/update_address`, {
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
  return http.get(`https://restapi.amap.com/v3/geocode/geo?address=${address}&key=${key}`);
}

// 根据经纬度获取地址
export function getAddressByLocation(location) {
  return http.get(`https://restapi.amap.com/v3/geocode/regeo?location=${location}&key=${key}`);
}

// 获取默认地址
export function getDefaultAddress() {
  return http.get(`${BaseUrl}/user/get_default_address`);
}

// 根据id获取地址
export function getAddress(addressId) {
  return http.get(`${BaseUrl}/user/get_address?addressId=${addressId}`);
}

// 根据经纬度店铺列表
export function getShopListByLocation(longitude, latitude) {
  return http.get(`${BaseUrl}/subbranch?longitude=${longitude}&latitude=${latitude}`);
}

// 直接获取店铺列表
export function getShopList() {
  return http.get(`${BaseUrl}/subbranch`);
}

// 更换店铺
export function changeShop(subbranchId) {
  return http.post(`${BaseUrl}/subbranch`, { current_subbranch_id: subbranchId });
}
