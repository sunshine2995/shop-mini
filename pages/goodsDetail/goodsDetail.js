Page({
  data: {
    active: 0,
  },

  toggle(e) {
    var active = e.currentTarget.dataset.index;
    this.setData({
      active: active,
    })
  },
  goToDescripte() {
    wx.navigateTo({
      url: '/pages/goodsDescription/goodsDescription',
    })
  },

  onLoad: function() {
    var images = [{
      img: "https://img.caibashi.com/a1d0984a51fc4283b8810929082ff1e7.jpg@2o",
    }, {
      img: "https://img.caibashi.com/254ea50f75c043e5c0e6a47090e1ce5f.png",
    }, {
      img: "https://img.caibashi.com/6086464e1432b219c9415e27298344a4.PNG",
    }, {
      img: "https://img.caibashi.com/254ea50f75c043e5c0e6a47090e1ce5f.png",
    }, ]

    var goodsSkuList = [{
      id: 297,
      name: "330-540/g",
      market_price: "12.48",
      unit_price: "11.00",
      stock: 999,
      sell_price: "11.88",
    }, {
      id: 682,
      name: "1600-2000/大条",
      market_price: "44.80",
      unit_price: "12.00",
      stock: 998,
      sell_price: "44.00",
    }]
    var sell_price = goodsSkuList[0].sell_price;
    this.setData({
      images: images,
      goodsSkuList: goodsSkuList,
      sell_price: sell_price,
    });
  }
})