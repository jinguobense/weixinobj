// pages/manjian/manjian.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],   //接口获取的列表
    page:1,    //当前页数
    bannerlist:[],     //轮播图列表
    maxpage: '',     //最多页数
    isend:false
  },
  getlist(){
    var _this = this;
    //获取满减数据
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getFullActShopList2',
        lng: wx.getStorageSync('longitude'),
        lat: wx.getStorageSync('latitude'),
        nowPage:_this.data.page,
        type:'2'
      },
      success: function (res) {
        console.log(res);
        _this.setData({
          bannerlist:res.data.adList,
          list: res.data.shopList,
          maxpage: res.data.totalPage,
          isend:true
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 0)
      },
    });
  },
  //跳转商品详情
  toxq(e) {
    var _this = this;
    var goodsid = e.currentTarget.dataset.goodsid
    wx.navigateTo({
      url: '../manjianxq/manjianxq?goodsid='+ goodsid
    })
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
        title: '没有更多店铺啦',
        icon: 'none',
        duration: 1000
      })
    } else {
      this.setData({
        page: _this.data.page + 1
      })
      wx.showLoading({
        title: '加载中',
      })
      _this.getist();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})