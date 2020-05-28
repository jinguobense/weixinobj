// pages/search/search.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tuijianlist: [],       //推荐搜索列表
    searchcon: '',            //搜索内容
    searchlishi: [],       //搜索历史
    shopid: '',
    changeindex:1,    //1宝贝 2店铺
  },
  changetabindex(){
    var i = this.data.changeindex;
    if(i == 1){
      this.setData({
        changeindex: 2
      })
    }else{
      this.setData({
        changeindex: 1
      })
    }
    
  },
  //清楚搜索记录
  clear() {
    wx.clearStorageSync('searchlishi')
    this.setData({
      searchlishi: []
    })
    wx.showToast({
      title: '清除成功',
      icon: 'none',
      duration: 1500
    })
  },
  // 监听搜索内容
  watch(e) {
    // console.log(e.detail.value)
    this.setData({
      searchcon: e.detail.value
    })
  },
  //历史搜索点击
  lishisearch(e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var list = this.data.searchlishi;
    if (this.data.changeindex == 2) {
      wx.navigateTo({
        url: '../searchshopend/searchshopend?search=' + list[index],
      })
    } else {
      wx.navigateTo({
        url: '../searchend/searchend?search=' + list[index],
      })
    }

  },
  //推荐搜索点击
  tuijiansearch(e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    if (!wx.getStorageSync("searchlishi")) {
      var arr = [];
      arr.push(this.data.tuijianlist[index])
      wx.setStorageSync("searchlishi", arr);
    } else {
      var arr = wx.getStorageSync("searchlishi");
      var type = false;
      for (var i in arr) {
        if (arr[i] == _this.data.tuijianlist[index]) {
          type = true;
        }
      }
      if (type == false) {
        arr.push(this.data.tuijianlist[index])
      }
      wx.setStorageSync("searchlishi", arr);
      
    }
    if (this.data.changeindex == 2) {
      wx.navigateTo({
        url: '../searchshopend/searchshopend?search=' + _this.data.tuijianlist[index],
      })
    } else {
      wx.navigateTo({
        url: '../searchend/searchend?search=' + _this.data.tuijianlist[index],
      })
    }
    
  },
  //跳转搜索详情
  tosearchend() {
    var _this = this;
    if (this.data.searchcon == '') {
      wx.showToast({
        title: '搜索内容不能为空',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    if (!wx.getStorageSync("searchlishi")) {
      var arr = [];
      arr.push(this.data.searchcon)
      wx.setStorageSync("searchlishi", arr);
    } else {
      var arr = wx.getStorageSync("searchlishi");
      var type = false;
      for(var i in arr){
        if (arr[i] == _this.data.searchcon){
          type = true;
        }
      }
      if(type == false){
        arr.push(this.data.searchcon)
      }
      wx.setStorageSync("searchlishi", arr);
    }
    if (this.data.changeindex == 2) {
      wx.navigateTo({
        url: '../searchshopend/searchshopend?search=' + _this.data.searchcon,
      })
    } else {
      wx.navigateTo({
        url: '../searchend/searchend?search=' + _this.data.searchcon,
      })
    }
  },
  // 获取推荐搜索
  getRecomSkeyList() {
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getRecomSkeyList',
        userId: wx.getStorageSync('userid'),
      },
      success: function success(res) {
        console.log(res);
        _this.setData({
          tuijianlist: res.data.searchKeyList
        })
      },
      fail: function fail() {
        // console.log("系统错误");
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.shopid) {
      this.setData({
        shopid: options.shopid
      })
    }
    this.getRecomSkeyList();
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
    if (wx.getStorageSync("searchlishi")) {
      this.setData({
        searchlishi: wx.getStorageSync("searchlishi")
      })
    }
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