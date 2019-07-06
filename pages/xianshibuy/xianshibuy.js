// pages/xianshibuy/xianshibuy.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headtabindex:'1',  //头部分类索引
    tabindex: '1',    //分类索引
  },
  // 头部分类tab切换
  changeheadtab(e) {
    // console.log(e.currentTarget.dataset.current)
    this.setData({
      headtabindex: e.currentTarget.dataset.current
    })
  },
  // 分类tab切换
  changetab(e) {
    // console.log(e.currentTarget.dataset.current)
    this.setData({
      tabindex: e.currentTarget.dataset.current
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