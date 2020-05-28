// pages/manjianmore/manjianmore.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopid:'',   //店铺id
    page:1,      //页数
    info:{}, 
    list:[],
    maxpage:'',

  },
  //跳转详情
  toxq(e){
    var goodsid = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: '../manjianxq/manjianxq?goodsid='+goodsid,
    })
  },
  //获取内容
  getlist(){
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getFullGoodsList2',
        shopId:_this.data.shopid,
        nowPage: _this.data.page,
        type: '2',
        searchKey:''
      },
      success: function (res) {
        console.log(res);
        if (_this.data.page == 1) {
          _this.setData({
            info: res.data,
            list: res.data.goodsList,
            maxpage: res.data.totalPage,
            isend: true
          })
        } else {
          var oldarr = _this.data.list;
          var newarr = res.data.goodsList;
          var endarr = oldarr.concat(newarr);
          _this.setData({
            info: res.data,
            list: endarr,
            maxpage: res.data.totalPage,
          })
        }

        setTimeout(function () {
          wx.hideLoading()
        }, 0)
      },
    });

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var shopid = options.shopid;
    this.setData({
      shopid:shopid
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getlist();
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