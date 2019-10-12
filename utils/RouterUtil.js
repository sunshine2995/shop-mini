const TAB_LIST = ['/pages/home/home', '/pages/cart/cart', '/pages/sort/sort', '/pages/user/user'];

export function go(path) {
  if (TAB_LIST.includes(path)) {
    wx.switchTab({
      url: path,
    });
  } else {
    wx.navigateTo({
      url: path,
    });
  }
}

export function back() {
  const pages = getCurrentPages();
  const page = pages[pages.length - 2];
  const path = `/${page.route}`;
  go(path);
}
