// pages/paysuccess/paysuccess.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    page: 1,    //页数
    guesslist: [],   //猜你喜欢推荐
    maxpage: '',     //猜你喜欢最大页数
    deadline:'',
  },
  //获得为您推荐
  getguesslist() {
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getFavoGoodsList',
        cityId: wx.getStorageSync('cityid'),
        userId: wx.getStorageSync('userid'),
        lng: wx.getStorageSync('longitude'),
        lat: wx.getStorageSync('latitude'),
        flag: 2,
        nowPage: _this.data.page
      },
      success: function success(res) {
        console.log(res);
        _this.setData({
          guesslist: res.data.goodsList,
          maxpage: res.data.totalPage
        })
        wx.hideLoading()
      }
    });
  },
  //跳转详情
  toxq(e) {
    var goodsid = e.currentTarget.dataset.goodsid;
    wx.redirectTo({
      url: '../shopxq/shopxq?goodsid=' + goodsid,
    })
    
  },
  //前往订单
  todd() {
    var orderid = this.data.orderid;
    wx.redirectTo({
      url: '../myddxq/myddxq?orderid=' + orderid + '&type=0',
    })
  },
  //返回首页
  tohome(){
    wx.switchTab({
      url: '../../../pages/index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderid = options.orderid;
    this.setData({
      orderid:orderid
    })
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
    if(wx.getStorageSync('endtime')){
      this.setData({
        deadline: wx.getStorageSync('endtime')
      })
    }
    this.getguesslist();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})