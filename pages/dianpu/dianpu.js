// pages/dianpu/dianpu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageheight: '',  //页面高
    tabindex: '1',    //分类索引
    foottype:false,    //是否滑到了固定位置
    uptype: false,   //右侧弹出框
    foottype:false,   //底部弹出框
    blackzt1: 'none',  //黑幕层显示/隐藏状态
    num: '1',         //购买数量
    showtype:false, 
    guigeindex: '1',    //规格索引
    sizexzbox: false,  //判断弹出框动画class
    blackzt: 'none',  //黑幕层显示/隐藏状态
  },
  // 去店铺简介
  tojianjie(){
    wx.navigateTo({
      url: '../dianpuxx/dianpuxx',
    })
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
  //规格切换
  changeguige(e) {
    this.setData({
      guigeindex: e.currentTarget.dataset.index
    })
  },
  //弹出尺码选择窗口
  tanchulistbox() {
    var _this = this;
    this.setData({
      blackzt1: 'block',
    })
    setTimeout(function () {
      _this.setData({
        showtype: !_this.data.showtype
      })
    }, 100)
  },
  //关闭尺码选择窗口
  closelistbox() {
    var _this = this;
    this.setData({
      showtype: !_this.data.showtype
    })
    setTimeout(function () {
      _this.setData({
        blackzt1: 'none'
      })
    }, 300)

  },
  // 分类tab切换
  changetab(e) {
    // console.log(e.currentTarget.dataset.current)
    this.setData({
      tabindex: e.currentTarget.dataset.current
    })
  },
  // 回到顶部
  totop(){
    this.setData({
      foottype: false,
      uptype: false,
      foottype: false,
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    
  },
  // 监听页面滚动
  onPageScroll: function (e) {
    // console.log(e.scrollTop + '++++++++++');//{scrollTop:99}
    var _this = this
    const query = wx.createSelectorQuery()
    query.select('#Footer').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      console.log(res[0].top + '-------')
      if (res[0].top == 0){
        _this.setData({
          foottype:true,
          uptype: true,
          foottype:true,
        })
      }
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
          pageheight: res.windowHeight * 2
        })
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