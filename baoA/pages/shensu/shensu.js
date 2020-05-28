// pages/shensu/shensu.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headindex:'0',
    page:1,
    maxpage:'',
    list:[],
  },
  //获得内容
  getlist(){
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getAppealMsgList',
        userId: wx.getStorageSync('userid'),
        nowPage: _this.data.page,
        state: _this.data.headindex
      },
      success: function success(res) {
        console.log(res);
        if (_this.data.page == 1) {
          _this.setData({
            list: res.data.appealList,
            maxpage: res.data.totalPage
          })
        } else {
          var oldarr = _this.data.list;
          var newarr = res.data.appealList;
          var endarr = oldarr.concat(newarr);
          _this.setData({
            list: endarr,
            maxpage: res.data.totalPage
          })
        }
        wx.hideLoading()

      }
    });
  },
  //跳转申诉详情
  toxq(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../shensuxq/shensuxq?id='+id,
    })
  },
  // 分类tab切换
  tabchange(e) {
    var _this = this;
    // console.log(e.currentTarget.dataset.current)
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      headindex: e.currentTarget.dataset.index,
      page:1
    })
    setTimeout(function(){
      _this.getlist();
    },0)
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
    this.setData({
      page: 1
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getlist();
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
    var _this = this;
    if (this.data.page == this.data.maxpage) {
      wx.showToast({
        title: '已经到底啦',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.showLoading({
        title: '加载中',
      })
      this.setData({
        page: _this.data.page + 1
      })
      _this.getlist();

    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})