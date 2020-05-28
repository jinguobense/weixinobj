// pages/newuser/newuser.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabindex: '0',    //分类索引
    moveParams: {
      scrollLeft: 0, // scroll-view滚动的距离,默认为0,因为没有触发滚动
      subLeft: 0, //点击元素距离屏幕左边的距离
      subHalfWidth: 0, //点击元素的宽度一半
      screenHalfWidth: 187.5, //屏幕宽度的一半
    },
    page:1,
    list:[],
    maxpage: '',     //最多页数
    headlist: [],    //头部类别
    imglist:[],
    isend:false
  },
  //获取参团分页分类
  getheadlist() {
    var _this = this;
    //获取参团分类数据
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getPfgTypeList',
        lng: wx.getStorageSync('longitude'),
        lat: wx.getStorageSync('latitude'),
        flag: 9
      },
      success: function (res) {
        console.log(res);
        _this.setData({
          headlist: res.data.pfgTypeList
        })
      },
    });
  },
  //获取新人专享列表
  getlist() {
    var _this = this;
    if (this.data.tabindex == 0) {
      var typeid1 = '';
    } else {
      var typeid1 = this.data.headlist[_this.data.tabindex - 1].pfgTypeId1;
    }
    //获取分类内容数据
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getNewPment',
        lng: wx.getStorageSync('longitude'),
        lat: wx.getStorageSync('latitude'),
        userId: wx.getStorageSync('userid'),
        pfgTypeId1: typeid1,
        nowPage: _this.data.page,
        searchKey: ''
      },
      success: function (res) {
        console.log(res);
        if (_this.data.page == 1) {
          _this.setData({
            list: res.data.goodsList,
            maxpage: res.data.totalPage,
            imglist: res.data.adList,
            isend: true
          })
        } else {
          var oldarr = _this.data.list;
          var newarr = res.data.goodsList;
          var endarr = oldarr.concat(newarr);
          _this.setData({
            list: endarr,
            maxpage: res.data.totalPage,
            imglist: res.data.adList
          })
        }
        setTimeout(function () {
          wx.hideLoading()
        }, 0)
      },
    });

  },
  //收藏店铺
  shoucangshop() {
    var _this = this;
    this.setData({
      shoptype: !_this.data.shoptype
    })
    var type;
    if (_this.data.shoptype) {
      type = 1;
    } else {
      type = 0;
    }
    //收藏/取消
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'collect',
        userId: wx.getStorageSync('userid'),
        type: 1,
        // goodsId: _this.data.shopId
        cid: _this.data.shopid,
        isCollect: type
      },
      success: function (res) {
        console.log(res);
        wx.showToast({
          title: res.data.resultNote,
          icon: 'none',
          duration: 1000
        })
      },
    });

  },
  //收藏商品
  shoucanggoods() {
    var _this = this;
    this.setData({
      goodstype: !_this.data.goodstype
    })
    var type;
    if (_this.data.goodstype) {
      type = 1;
    } else {
      type = 0;
    }
    //收藏/取消
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'collect',
        userId: wx.getStorageSync('userid'),
        type: 0,
        // goodsId: _this.data.goodsid
        cid: _this.data.goodsid,
        isCollect: type
      },
      success: function (res) {
        console.log(res);
        wx.showToast({
          title: res.data.resultNote,
          icon: 'none',
          duration: 1000
        })
      },
    });

  },
  //跳转详情
  toxq(e){
    var goodsid = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: '../newuserxqq/newuserxqq?goodsid='+goodsid,
    })
  },
  // tab滑动动画
  getRect(ele) { //获取点击元素的信息,ele为传入的id
    var that = this;
    wx.createSelectorQuery().select(ele).boundingClientRect(function (rect) {
      let moveParams = that.data.moveParams;
      moveParams.subLeft = rect.left;
      moveParams.subHalfWidth = rect.width / 2;
      that.moveTo();
    }).exec()
  },
  changetab: function (e) {
    let ele = 'ele' + e.target.dataset.current
    this.setData({
      tabindex: e.target.dataset.current,
      page:1
    });
    this.getRect('#' + ele);
    wx.showLoading({
      title: '加载中',
    })
    this.getlist();
  },
  scrollMove(e) {
    let moveParams = this.data.moveParams;
    moveParams.scrollLeft = e.detail.scrollLeft;
    this.setData({
      moveParams: moveParams
    })
    // console.log(e)
  },
  moveTo: function () {
    let subLeft = this.data.moveParams.subLeft;
    let screenHalfWidth = this.data.moveParams.screenHalfWidth;
    let subHalfWidth = this.data.moveParams.subHalfWidth;
    let scrollLeft = this.data.moveParams.scrollLeft;

    let distance = subLeft - screenHalfWidth + subHalfWidth;

    scrollLeft = scrollLeft + distance;
    // console.log(subLeft)
    this.setData({
      scrollLeft: scrollLeft
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
    this.setData({
      page: 1
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getheadlist();
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