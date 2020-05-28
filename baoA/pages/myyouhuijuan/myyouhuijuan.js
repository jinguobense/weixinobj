// pages/myyouhuijuan/myyouhuijuan.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerindex:'0',      //头部index
    page:1,
    list:[],       //商品优惠券
    maxpage:'',
    isend:false
  },
  //跳转店铺
  todianpu(e){
    var _this = this;
    var shopid = e.currentTarget.dataset.shopid;
    var goodsid = e.currentTarget.dataset.goodsid;
    if(goodsid){
      wx.navigateTo({
        url: '../shopxq/shopxq?goodsid=' + goodsid,
      })
    }else{
      wx.navigateTo({
        url: '../dianpu/dianpu?shopid=' + shopid,
      })
    }
    
  },
  //获得优惠券列表
  getlist(){
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getMyCouponList',
        userId: wx.getStorageSync('userid'),
        lng: wx.getStorageSync('longitude'),
        lat: wx.getStorageSync('latitude'),
        flag:_this.data.headerindex,
        sortRule:0,
        nowPage:_this.data.page
        
      },
      success: function success(res) {
        console.log(res);
        var list = res.data.shopBeans;
        for(var i in list){
          list[i].shopScore = Math.round(list[i].shopScore)
        }
        if (_this.data.page == 1) {
          _this.setData({
            list: list,
            maxpage: res.data.totalPage,
            isend:true
          })
        } else {
          var oldarr = _this.data.list;
          var newarr = list;
          var endarr = oldarr.concat(newarr);
          _this.setData({
            list: oldarr,
            maxpage: res.data.totalPage
          })
        }
        wx.hideLoading()
      }
    });
  },
  tabchange(e){
    var _this = this;
    wx.showLoading({
      title: '加载中',
    })
    _this.setData({
      headerindex: e.currentTarget.dataset.index,
      list:[],
      isend:false
    })
    setTimeout(function(){
      _this.getlist();
    },50) 
      
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
      this.setData({
        page: _this.data.page + 1
      })
      wx.showLoading({
        title: '加载中',
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