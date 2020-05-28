// pages/youhuishop/youhuishop.js
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
    headlist:[],
    juanid:'',
    page:1,
    searchcon:'',
    conlist:[],
    maxpage:'',
  },
  //获取内容列表
  getconlist() {
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
        cmd: 'couponToUseGoodsList',
        pfgTypeId1: typeid1,
        nowPage: _this.data.page,
        searchKey: _this.data.searchcon,
        couponId: _this.data.juanid
      },
      success: function (res) {
        console.log(res);
        if (_this.data.page == 1) {
          _this.setData({
            conlist: res.data.goodsbean,
            maxpage: res.data.totalPage,
            searchcon: '',
          })
        } else {
          var oldarr = _this.data.conlist;
          var newarr = res.data.goodsbean;
          var endarr = oldarr.concat(newarr);
          _this.setData({
            conlist: endarr,
            maxpage: res.data.totalPage,
            searchcon: '',
          })
        }
        setTimeout(function () {
          wx.hideLoading()
        }, 0)
      },
    });
  },
  //搜索
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
    else {
      this.setData({
        page: 1,
      });
      wx.showLoading({
        title: '加载中',
      })
      _this.getconlist();
    }
  },
  //获取附近分页分类
  getheadlist() {
    var _this = this;
    //获取附近分类数据
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'getCouponPfgTypeList',
        couponId:_this.data.juanid
      },
      success: function (res) {
        console.log(res);
        _this.setData({
          headlist: res.data.pfgTypeList
        })
        wx.hideLoading()
      },
    });
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
      page:1,
    });
    this.getRect('#' + ele);
    wx.showLoading({
      title: '加载中',
    })
    this.getconlist();
  },
  scrollMove(e) {
    let moveParams = this.data.moveParams;
    moveParams.scrollLeft = e.detail.scrollLeft;
    this.setData({
      moveParams: moveParams
    })
    console.log(e)
  },
  moveTo: function () {
    let subLeft = this.data.moveParams.subLeft;
    let screenHalfWidth = this.data.moveParams.screenHalfWidth;
    let subHalfWidth = this.data.moveParams.subHalfWidth;
    let scrollLeft = this.data.moveParams.scrollLeft;

    let distance = subLeft - screenHalfWidth + subHalfWidth;

    scrollLeft = scrollLeft + distance;
    console.log(subLeft)
    this.setData({
      scrollLeft: scrollLeft
    })
  },
  //跳转商品详情
  toxq(e) {
    var _this = this;
    var goodsid = e.currentTarget.dataset.goodsid;
    var type = e.currentTarget.dataset.type;
    if(type==0){
      wx.navigateTo({
        url: '../shopxq/shopxq?goodsid='+goodsid,
      })
    }
    if (type == 1) {
      wx.navigateTo({
        url: '../cantuanxq/cantuanxq?goodsid=' + goodsid,
      })
    }
    if (type == 3) {
      wx.navigateTo({
        url: '../manjianxq/manjianxq?goodsid=' + goodsid,
      })
    }
    if (type == 4) {
      wx.navigateTo({
        url: '../xianshibuyxq/xianshibuyxq?goodsid=' + goodsid,
      })
    }
  },
  // 监听搜索内容
  watch(e) {
    // console.log(e.detail.value)
    this.setData({
      searchcon: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var juanid = options.juanid;
    this.setData({
      juanid:juanid
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
    var _this =this;
    wx.showLoading({
      title: '加载中',
    })
    this.getheadlist();
    setTimeout(function(){
      _this.getconlist();
    },50)
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
      _this.getconlist();
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})