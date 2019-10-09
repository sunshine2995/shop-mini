import * as axios from '../libs/axios';
import config from '../config/config';

console.log('http.js: config: ', config);

const http = axios.create(config.baseURL);

export default http;
