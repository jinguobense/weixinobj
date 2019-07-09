// pages/manjianxq/manjianxq.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabindex: '1',     //tab切换index
    id: 'maodian1',   //初始锚点id
    pageheight: '',  //滑动页面高
    sizexzbox: false,  //判断弹出框动画class
    blackzt: 'none',  //黑幕层显示/隐藏状态
    guigeindex:'1',    //规格索引
    num:'1',  //购买数量
  },
  //跳转确认订单
  tosuredd(){
    wx.navigateTo({
      url: '../suredd/suredd',
    })
  },
  // 推荐商品tab切换锚点
  changetab(e) {
    // console.log(e.currentTarget.dataset.current)

    this.setData({
      tabindex: e.currentTarget.dataset.current,
      id: e.currentTarget.dataset.idr
    })
  },
  //规格切换
  changeguige(e){
    this.setData({
      guigeindex: e.currentTarget.dataset.index
    })
  },
  // 页面滚动事件监听
  pagescroll(e) {
    // console.log(e.detail.scrollTop + '1111')
    var _this = this;
    var index;
    const query = wx.createSelectorQuery()
    query.select('#maodian1').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      if (res[0].top <= 200) {
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
  //弹出尺码选择窗口
  tanchusizebox() {
    var _this = this;
    this.setData({
      blackzt: 'block',
      
    })
    setTimeout(function () {
      _this.setData({
        sizexzbox: !_this.data.sizexzbox
      })
    }, 100)
  },
  //关闭尺码选择窗口
  closechoosebox() {
    var _this = this;
    this.setData({
      sizexzbox: !_this.data.sizexzbox
    })
    setTimeout(function () {
      _this.setData({
        blackzt: 'none'
      })
    }, 300)

  },
  //加
  spinnerJia: function () {
    var that = this;
    this.data.num++;
    this.setData({
      num: this.data.num
    })
  },

  //减
  spinnerJian: function () {
    var that = this;
    if (this.data.num > 1) {
      this.data.num--;
    }
    this.setData({
      num: this.data.num
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
          pageheight: res.windowHeight*2 -200
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