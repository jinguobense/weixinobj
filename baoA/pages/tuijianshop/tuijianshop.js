// pages/tuijianshop/tuijianshop.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList:[],    //列表
    con:'',        //搜索内容
    page:1,
    maxpage:'',
  },
  //搜索
  tosearchend() {
    // var _this = this;
    // this.setData({
    //   page: 1,
    // });
    // wx.showLoading({
    //   title: '加载中',
    // })
    // _this.getlist();
    var _this = this;
    if (this.data.con == '') {
      wx.showToast({
        title: '搜索内容不能为空',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    wx.navigateTo({
      url: '../../../pages/searchshopend/searchshopend?search=' + _this.data.con,
    })
  },
  // 监听搜索内容
  watch(e) {
    // console.log(e.detail.value)
    this.setData({
      con: e.detail.value
    })
  },
  //跳转到店铺
  toxq(e) {
    var _this = this;
    var goodsid = e.currentTarget.dataset.goodsid;
    if (e.currentTarget.dataset.shopid) {
      var shopid = e.currentTarget.dataset.shopid;
    }
    var type = e.currentTarget.dataset.shoptype;
    if (type == 0) {
      wx.navigateTo({
        url: '../shopxq/shopxq?goodsid=' + goodsid,
      })
    }
    if (type == 5) {
      wx.navigateTo({
        url: '../pintuanxq/pintuanxq?goodsid=' + goodsid + '&shopid=' + shopid,
      })
    }
    if (type == 2) {
      wx.navigateTo({
        url: '../manjianxq/manjianxq?goodsid=' + goodsid,
      })
    }
    if (type == 3) {
      wx.navigateTo({
        url: '../xianshibuyxq/xianshibuyxq?goodsid=' + goodsid,
      })
    }
    if (type == 4) {
      wx.navigateTo({
        url: '../zhixiaoxq/zhixiaoxq?goodsid=' + goodsid,
      })
    }
    if (type == 1) {
      wx.navigateTo({
        url: '../cantuanxq/cantuanxq?goodsid=' + goodsid,
      })
    }

  },
  //获取数据
  getlist(){
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getNearShopList',
        lng: wx.getStorageSync('longitude'),
        lat: wx.getStorageSync('latitude'),
        searchKey:_this.data.con,
        nowPage:_this.data.page
      },
      success: function (res) {
        console.log(res);
        var list = res.data.shopList;
        for (var i in list) {
          list[i].shopScore = Math.round(list[i].shopScore)
        }
        _this.setData({
          shopList: list,
          maxpage: res.data.totalPage
        })
        wx.hideLoading();
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      page: 1
    })
    wx.showLoading({
      title: '加载中',

    })
    this.getlist();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      con: ''
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _this = this;
    if (this.data.page == this.data.maxpage) {
      wx.showToast({
        title: '已经到底啦',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.showLoading({
        title: '加载中',
      })
      this.setData({
        page: _this.data.page + 1
      })
      _this.getlist();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})