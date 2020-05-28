// pages/kefuhelp/kefuhelp.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tel:'',
    token:'',
  },
  //跳转客服
  tokefu() {
    var _this = this;
    var friendid = this.data.token;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getChatFace',
        userId: friendid,
        flag: 1
      },
      success: function success(res) {
        console.log(res);
        var name = res.data.chatName;
        var img = res.data.chatFace;
        if (res.data.result == 0) {
          wx.navigateTo({
            url: '../kefu/kefu?friendId=' + friendid + '&friendName=' + name + '&friendAvatarUrl=' + img,
          })
        }
      }
    });
  },
  //打电话
  tocall(){
    var tel = this.data.tel;
    wx.showModal({
      title: '提示',
      confirmColor:'#159600',
      content: '是否给'+tel+'打电话？',
      success(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: tel //仅为示例，并非真实的电话号码
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //跳转反馈
  tofankui(){
    wx.navigateTo({
      url: '../fankui/fankui',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tel = options.tel;
    var token = options.token;
    this.setData({
      tel:tel,
      token:token
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