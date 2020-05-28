// pages/fankui/fankui.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tit:'',   //主题
    con:'',    //内容
  },
  //提交
  msg(){
    if(this.data.tit == ''){
      wx.showToast({
        title: '请输入反馈主题',
        icon:'none',
        duration:1500
      })
      return false;
    }
    if (this.data.con == '') {
      wx.showToast({
        title: '请输入反馈内容',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    var _this = this;
    //获取推荐商品数据
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'feedBack',
        userId: wx.getStorageSync('userid'),
        fdTitle: _this.data.tit,              //反馈主题
        fdContent: _this.data.con,          //反馈内容

      },
      success: function success(res) {
        // console.log(res);
        if(res.data.result == 0){
          wx.showToast({
            title: res.data.resultNote,
            duration:1500,
            icon:'none'
          })
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },1500)
        }
        
      },
      fail: function fail() {
        // console.log("系统错误");
      }
    });
  },
  //主题监听
  titwatch(e){
    // console.log(e.detail.value)
    this.setData({
      tit: e.detail.value
    })
  },
  //内容监听
  conwatch(e) {
    // console.log(e)
    this.setData({
      con: e.detail.value
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