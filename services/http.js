import * as axios from '../libs/axios';
import config from '../config/config';
import utilMd5 from '../utils/md5';

console.log('http.js: config: ', config);

const http = axios.create(config.baseURL);
const getTime = () => Math.floor(Date.now() / 1000);

const generateSignature = (timestamp) => {
  const key = `${timestamp}.Caibasi168`;
  return utilMd5.hexMD5(key);
};

http.addRequestInterceptor((header) => {
  const token = wx.getStorageSync('token');
  const timestamp = getTime();
  const signature = generateSignature(timestamp);
  header.Authorization = token;
  header.Timestamp = timestamp;
  header.Signature = signature;
});

export default http;
