// pages/pingjialist/pingjialist.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag:'',
    goodsid:'',
    pingjialist:[],
    page:1,
    maxpage:'',
  },
  bigimg(e) {
    var url = e.currentTarget.dataset.url;
    var index = e.currentTarget.dataset.index;
    var list = this.data.pingjialist[index].imgList;
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: list // 需要预览的图片http链接列表
    })
  },
  //获取该商品评价
  getpingjia() {
    var _this = this;
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getGoodsCmtList',
        userId: wx.getStorageSync('userid'),
        // goodsId: _this.data.goodsid
        goodsId: _this.data.goodsid,
        flag: _this.data.flag,
        nowPage: _this.data.page,
      },
      success: function (res) {
        console.log(res);
        if (_this.data.page == 1) {
          _this.setData({
            pingjialist: res.data.commentList,
            maxpage: res.data.totalPage,
          })
        } else {
          var oldarr = _this.data.pingjialist;
          var newarr = res.data.commentList;
          var endarr = oldarr.concat(newarr);
          _this.setData({
            pingjialist: endarr,
            maxpage: res.data.totalPage,
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
    var goodsid = options.goodsid;
    var flag = options.flag;
    this.setData({
      goodsid:goodsid,
      flag:flag
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
    wx.showLoading({
      title: '加载中',
    })
    this.getpingjia();
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
      _this.getpingjia();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})