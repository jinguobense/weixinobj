// pages/zhixiao/zhixiao.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,     //页数
    maxpage:'',
    conlist:[],   //内容列表
    shopid:'',
    isend:false
  },
  //获取直销列表
  getlist(){
    var _this = this;
    var shopid = this.data.shopid;
    if(shopid){
      //获取分类内容数据
      wx.request({
        url: app.globalData.url, //自己的服务接口地址
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: 'getDirectDealGoods',
          shopId:shopid,
          userId: wx.getStorageSync('userid'),
          pfgTypeId1: '',
          pfgTypeId2: '',
          nowPage: _this.data.page,
          searchKey: ''
        },
        success: function (res) {
          console.log(res);
          if (_this.data.page == 1) {
            _this.setData({
              conlist: res.data.goodsList,
              maxpage: res.data.totalPage,
              isend: true
            })
          } else {
            var oldarr = _this.data.conlist;
            var newarr = res.data.goodsList;
            var endarr = oldarr.concat(newarr);
            _this.setData({
              conlist: endarr,
              maxpage: res.data.totalPage,
            })
          }
          setTimeout(function () {
            wx.hideLoading()
          }, 0)
        },
      });
    }else{
      //获取分类内容数据
      wx.request({
        url: app.globalData.url, //自己的服务接口地址
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: 'getDirectDealGoods',
          lng: wx.getStorageSync('longitude'),
          lat: wx.getStorageSync('latitude'),
          userId: wx.getStorageSync('userid'),
          pfgTypeId1: '',
          pfgTypeId2: '',
          nowPage: _this.data.page,
          searchKey: ''
        },
        success: function (res) {
          console.log(res);
          if (_this.data.page == 1) {
            _this.setData({
              conlist: res.data.goodsList,
              maxpage: res.data.totalPage,
              isend: true
            })
          } else {
            var oldarr = _this.data.conlist;
            var newarr = res.data.goodsList;
            var endarr = oldarr.concat(newarr);
            _this.setData({
              conlist: endarr,
              maxpage: res.data.totalPage,
            })
          }
          setTimeout(function () {
            wx.hideLoading()
          }, 0)
        },
      });
    }
    
    
  },
  //跳转直销详情
  tozhixiaoxq(e){
    var goodsid = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: '../zhixiaoxq/zhixiaoxq?goodsid='+goodsid,
    })
  },
  //跳转直销详情限时
  tozhixiaoxqxs() {
    wx.navigateTo({
      url: '../zhixiaoxqxs/zhixiaoxqxs',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var shopid;
    if(options.shopid){
      shopid = options.shopid;
    }else{
      shopid = ''
    }
    this.setData({
      shopid:shopid
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