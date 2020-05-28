// pages/user/user.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:{},       //用户基本信息
  },
  //登录
  tologin(){
    var userinfo = this.data.userinfo;
    if (!userinfo.nickName){
      wx.navigateTo({
        url: '../../baoA/pages/shouquan/shouquan',
      })
    }
  },
  
  //获取个人用户信息
  getuserxx(){
    var _this = this;
    //获取推荐商品数据
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getMineInfo',
        userId: wx.getStorageSync('userid'),

      },
      success: function success(res) {
         console.log(res);
        _this.setData({
          userinfo:res.data
        })
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh();
      },
      fail: function fail() {
        // console.log("系统错误");
      }
    });
  },
  // 跳转到我的订单
  tomydd(e) {
    if (!wx.getStorageSync('userid')){
      wx.navigateTo({
        url: '../../baoA/pages/shouquan/shouquan',
      })
      return false;
    }
    console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index;
    if(index){
      wx.navigateTo({
        url: '../../baoA/pages/mydd/mydd?index='+ index,
      })
    }else{
      wx.navigateTo({
        url: '../../baoA/pages/mydd/mydd',
      })
    }
    // wx.navigateTo({
    //   url: '../../baoA/pages/mydd/mydd',
    // })
  },
  // 跳转到客服帮助
  tokefuhelp() {
    if (!wx.getStorageSync('userid')) {
      wx.navigateTo({
        url: '../../baoA/pages/shouquan/shouquan',
      })
      return false;
    }
    var tel = this.data.userinfo.custSerPhone
    var friendid = this.data.userinfo.custSerRcToken
    // wx.navigateTo({
    //   url: '../../baoA/pages/kefuhelp/kefuhelp?tel=' + tel + '&token=' + custSerRcToken,
    // })
    // var friendid = this.data.info.shopRcToken;
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
            url: '../../baoA/pages/kefu/kefu?friendId=' + friendid + '&friendName=' + name + '&friendAvatarUrl=' + img,
          })
        }
      }
    });
  },
  // 跳转我的收藏
  tomyshoucang() {
    if (!wx.getStorageSync('userid')) {
      wx.navigateTo({
        url: '../../baoA/pages/shouquan/shouquan',
      })
      return false;
    }
    wx.navigateTo({
      url: '../../baoA/pages/myshoucang/myshoucang',
    })
  },
  //跳转到优惠卷
  toyouhuijuan() {
    if (!wx.getStorageSync('userid')) {
      wx.navigateTo({
        url: '../../baoA/pages/shouquan/shouquan',
      })
      return false;
    }
    wx.navigateTo({
      url: '../../baoA/pages/myyouhuijuan/myyouhuijuan',
    })
  },

  // 跳转到消息
  tomsg() {
    if (!wx.getStorageSync('userid')) {
      wx.navigateTo({
        url: '../../baoA/pages/shouquan/shouquan',
      })
      return false;
    }
    wx.navigateTo({
      url: '../msg/msg',
    })
  },
  // 跳转到地址
  todizhi() {
    if (!wx.getStorageSync('userid')) {
      wx.navigateTo({
        url: '../../baoA/pages/shouquan/shouquan',
      })
      return false;
    }
    wx.navigateTo({
      url: '../../baoA/pages/dizhi/dizhi',
    })
  },
  // 跳我的足迹
  tomyzuji(){
    if (!wx.getStorageSync('userid')) {
      wx.navigateTo({
        url: '../../baoA/pages/shouquan/shouquan',
      })
      return false;
    }
    wx.navigateTo({
      url: '../../baoA/pages/myzuji/myzuji',
    })
  },
  // 跳分享
  toshare() {
    if (!wx.getStorageSync('userid')) {
      wx.navigateTo({
        url: '../../baoA/pages/shouquan/shouquan',
      })
      return false;
    }
    wx.navigateTo({
      url: '../../baoA/pages/share/share',
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
    this.getuserxx();
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
    wx.showNavigationBarLoading();
    this.getuserxx()
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