// pages/retuimore/retuimore.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    maxpage:'',
    flag:'',
    shopid:'',
    nearlist:[],
  },
  //跳转详情
  toxq(e){
    var _this = this
    var goodsid = e.currentTarget.dataset.goodsid;
    if(this.data.flag == 1){
      wx.navigateTo({
        url: '../cantuanxq/cantuanxq?goodsid='+ goodsid,
      })
    }
    if (this.data.flag == 5) {
      wx.navigateTo({
        url: '../pintuanxq/pintuanxq?goodsid=' + goodsid,
      })
    }
    if (this.data.flag == 3){
      var type = e.currentTarget.dataset.shoptype;
      if (type == 0) {
        wx.navigateTo({
          url: '../shopxq/shopxq?goodsid=' + goodsid,
        })
      }
      if (type == 6) {
        wx.navigateTo({
          url: '../pintuanxq/pintuanxq?goodsid=' + goodsid,
        })
      }
      if (type == 1) {
        wx.navigateTo({
          url: '../manjianxq/manjianxq?goodsid=' + goodsid,
        })
      }
      if (type == 2) {
        wx.navigateTo({
          url: '../xianshibuyxq/xianshibuyxq?goodsid=' + goodsid,
        })
      }
      if (type == 5) {
        wx.navigateTo({
          url: '../zhixiaoxq/zhixiaoxq?goodsid=' + goodsid,
        })
      }
      if (type == 3) {
        wx.navigateTo({
          url: '../cantuanxq/cantuanxq?goodsid=' + goodsid,
        })
      }
    }
  },
  //获取附近热推
  getnearlist() {
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getNgGoodsList',
        flag: _this.data.flag,
        shopId: _this.data.shopid,
        searchKey: '',
        nowPage: _this.data.page,
        lng: wx.getStorageSync('longitude'),
        lat: wx.getStorageSync('latitude'),
      },
      success: function (res) {
        console.log(res);
        if(_this.data.page == 1){
          _this.setData({
            nearlist: res.data.goodsList,
            maxpage: res.data.totalPage
          })
        }else{
          var oldarr = _this.data.nearlist;
          var newarr = res.data.goodsList;
          var endarr = oldarr.concat(newarr);
          _this.setData({
            nearlist: endarr,
            maxpage: res.data.totalPage
          })
        }
        
        wx.hideLoading()
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var shopid = options.shopid;
    var flag = options.flag;
    this.setData({
      flag:options.flag,
      shopid:options.shopid
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
    this.getnearlist();
    
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
      _this.getnearlist();
      
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})