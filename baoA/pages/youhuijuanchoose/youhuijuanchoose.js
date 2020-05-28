// pages/youhuijuanchoose/youhuijuanchoose.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
  },
  //使用
  touse(e){
    var juanid = e.currentTarget.dataset.juanid;
    var juanmoney = e.currentTarget.dataset.juanmoney;
    var juantype = e.currentTarget.dataset.juantype;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    //不需要页面更新
    prevPage.setData({
      juanid: juanid,
      juanmoney: juanmoney,
      juantype: juantype
    })
    wx.navigateBack({
      delta:1
    })
  },
  //使用
  nouse(e) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    //不需要页面更新
    prevPage.setData({
      juanid: '',
      juanmoney: '',
      juantype: ''
    })
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var list = options.list;
    var list = JSON.parse(list)
    console.log(list)
    this.setData({
      list:list
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