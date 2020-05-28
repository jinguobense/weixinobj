// pages/shensuxq/shensuxq.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    con:{},
    id:''
  },
  bigimg(e) {
    var url = e.currentTarget.dataset.url;
    var list = this.data.con.imgList;
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: list // 需要预览的图片http链接列表
    })
  },
  getcon(){
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getAppealMsgDetail',
        userId: wx.getStorageSync('userid'),
        appealId:_this.data.id
      },
      success: function success(res) {
        console.log(res);
        _this.setData({
          con: res.data.appealDetail
        })
        
        wx.hideLoading()

      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      id:id
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
    wx.showLoading({
      title: '加载中',
    })
    this.getcon();
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