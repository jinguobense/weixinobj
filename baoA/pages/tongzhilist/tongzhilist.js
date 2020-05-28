// pages/tongzhilist/tongzhilist.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,        //页数
    list:[],     //列表
    maxpage:'',
  },
  //跳转到通知详情
  totongzhi(e){
    var _this = this;

    var orderid = e.currentTarget.dataset.orderid;
    var type = e.currentTarget.dataset.type;
    var flag = e.currentTarget.dataset.flag;
    var state = e.currentTarget.dataset.state;
    var msgid = e.currentTarget.dataset.msgid;
    if(state == 0){
      wx.request({
        url: app.globalData.url, //自己的服务接口地址
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: 'upMsgState',
          messageId: msgid,
          state: 0
        },
        success: function success(res) {
        }
      });
    }
    if(type == 1){
      if(flag == 0){
        wx.navigateTo({
          url: '../myddxq/myddxq?orderid=' + orderid + '&type=1'
        })
      }else{
        wx.navigateTo({
          url: '../myddxq/myddxq?orderid=' + orderid + '&type=8'
        })
      }
    }


    // wx.navigateTo({
    //   url: '../tongzhi/tongzhi',
    // })
  },
  //获取通知列表
  getlist(){
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getSystemMsgList',
        userId: wx.getStorageSync('userid'),
        nowPage: _this.data.page
      },
      success: function success(res) {
        console.log(res);
        wx.hideLoading()
        if (res.data.messageList.length >0){
          if (_this.data.page == 1) {
            _this.setData({
              list: res.data.messageList,
              maxpage: res.data.totalPage
            })
          } else {
            var oldarr = _this.data.list;
            var newarr = res.data.messageList;
            var endarr = oldarr.concat(newarr);
            _this.setData({
              list: endarr,
              maxpage: res.data.totalPage
            })
          }
        }else{
          wx.showToast({
            title: '暂无通知',
            icon:'none',
            duration:1000
          })
        }
        
        

      }
    });
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