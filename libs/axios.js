import * as wxRequest from '../utils/wxRequest';

class Axios {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.header = {
      'Content-Type': 'application/json',
    };
    this.requestInterceptors = [];
  }

  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  request(method, url, data) {
    this.requestInterceptors.forEach((interceptor) => {
      interceptor(this.header);
    });
    const fullPath = buildFullPath(this.baseURL, url);
    return wxRequest.wxPromise(method, fullPath, data, this.header);
  }

  get(url, data) {
    return this.request('GET', url, data);
  }

  post(url, data) {
    return this.request('POST', url, data);
  }

  delete(url, data) {
    return this.request('DELETE', url, data);
  }

  put(url, data) {
    return this.request('PUT', url, data);
  }
}

function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}

function combineURLs(baseURL, relativeURL) {
  return baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '');
}

function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

export function create(baseURL) {
  return new Axios(baseURL);
}
