// pages/dizhi/dizhi.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],    //地址列表
    type:false,
    isend:false
  },
  choosedizhi(e){
    var type = this.data.type;
    var list = this.data.list;
    var index = e.currentTarget.dataset.index;
    var addr = list[index]
    if(type == true){
      var pages = getCurrentPages();   //当前页面
      var prevPage = pages[pages.length - 2];   //上一页面
      prevPage.setData({
        addr:addr,
        addrtype:true
      });
      wx.navigateBack({
        delta: 1
      })
    }
  },
  //删除地址
  deladdress(e){
    var id = e.currentTarget.dataset.id;
    var _this = this;
    wx.showModal({
      title: '提示',
      content: '是否确定删除该地址?',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url, //自己的服务接口地址
            method: "post",
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            data: {
              cmd: 'deleteAddr',
              userId: wx.getStorageSync('userid'),
              addrId: id
            },
            success: function success(res) {
              // console.log(res);
              if (res.data.result == 0) {
                wx.showToast({
                  title: res.data.resultNote,
                  icon: 'none',
                  duration: 1000
                })
                setTimeout(function () {
                  _this.getlist();
                }, 1000)
              }
            },
            fail: function fail() {
              // console.log("系统错误");
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

    
  },
  //设为默认地址
  setmoren(e){
    var id = e.currentTarget.dataset.id;
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'setDefaultAddr',
        userId: wx.getStorageSync('userid'),
        addrId:id
      },
      success: function success(res) {
        console.log(res);
        if(res.data.result == 0){
          wx.showToast({
            title: res.data.resultNote,
            icon:'none',
            duration:1000
          })
          setTimeout(function(){
            _this.getlist();
          },1000)
        }
      },
      fail: function fail() {
        // console.log("系统错误");
      }
    });

  },
  //获取个人收货地址列表
  getlist(){
    var _this = this;
    //获取推荐商品数据
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getMyAddrList',
        userId: wx.getStorageSync('userid'),
        nowPage:1,
        lng: wx.getStorageSync('longitude'),
        lat: wx.getStorageSync('latitude'),
      },
      success: function success(res) {
        console.log(res);
        _this.setData({
          list:res.data.addrList,
          isend:true
        })
      },
      fail: function fail() {
        // console.log("系统错误");
      }
    });
  },
  //跳转添加地址
  toadddizhi(){
    wx.navigateTo({
      url: '../adddizhi/adddizhi',
    })
  },
  //跳转编辑地址
  todizhibj(e) {
    var index = e.currentTarget.dataset.index;
    var arr = this.data.list;
    var str = JSON.stringify(arr[index]) 
    wx.navigateTo({
      url: '../dizhibj/dizhibj?obj=' + str,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type == 1){
      this.setData({
        type:true
      })
    }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})