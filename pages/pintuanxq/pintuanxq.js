// pages/pintuanxq/pintuanxq.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabindex:'1',     //tab切换index
    id:'maodian1',   //初始锚点id
    pageheight: '',  //滑动页面高
  },
  // 推荐商品tab切换锚点
  changetab(e) {
    // console.log(e.currentTarget.dataset.current)
    
    this.setData({
      tabindex: e.currentTarget.dataset.current,
      id: e.currentTarget.dataset.idr
    })
  },
  // 页面滚动事件监听
  pagescroll(e){
    // console.log(e.detail.scrollTop + '1111')
    var _this = this;
    var index;
    const query = wx.createSelectorQuery()
    query.select('#maodian1').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      if(res[0].top <= 200){
        index = 1;
      }
      const query = wx.createSelectorQuery()
      query.select('#maodian2').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
        if (res[0].top <= 200) {
          index = 2;
        }
        const query = wx.createSelectorQuery()
        query.select('#maodian3').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(function (res) {
          if (res[0].top <= 200) {
            index = 3;
          }
          const query = wx.createSelectorQuery()
          query.select('#maodian4').boundingClientRect()
          query.selectViewport().scrollOffset()
          query.exec(function (res) {
            if (res[0].top <= 200) {
              index = 4;
            }
            _this.setData({
              tabindex: index,
            })
          })
        })
      })
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
    var _this = this;
    wx.getSystemInfo({
      success(res) {
        console.log(res)
        _this.setData({
          pageheight: res.windowHeight * 2 - 200
        })
        console.log(res.windowHeight * 2 - 200)
      }
    })
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