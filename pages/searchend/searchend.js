// pages/searchend/searchend.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList:[],    //商品列表
    searchcon: '',            //搜索内容
    page:1,         //搜索页数
    shopid:'',
    maxpage:'',
    isend:false
  },
  //跳转到详情
  toxq(e) {
    var _this = this;
    var goodsid = e.currentTarget.dataset.goodsid;

    var type = e.currentTarget.dataset.shoptype;
    var rttype = e.currentTarget.dataset.rttype;
      if (type == 0 || rttype == 0) {
        wx.navigateTo({
          url: '../../baoA/pages/shopxq/shopxq?goodsid=' + goodsid,
        })
      }
    if (type == 5 || rttype == 6) {
        wx.navigateTo({
          url: '../../baoA/pages/pintuanxq/pintuanxq?goodsid=' + goodsid,
        })
      }
    if (type == 2  || rttype == 1) {
        wx.navigateTo({
          url: '../../baoA/pages/manjianxq/manjianxq?goodsid=' + goodsid,
        })
      }
    if (type == 3 || rttype == 2) {
        wx.navigateTo({
          url: '../../baoA/pages/xianshibuyxq/xianshibuyxq?goodsid=' + goodsid,
        })
      }
    if (type == 4 || rttype == 5) {
        wx.navigateTo({
          url: '../../baoA/pages/zhixiaoxq/zhixiaoxq?goodsid=' + goodsid,
        })
      }
    if (type == 1 || rttype == 3) {
        wx.navigateTo({
          url: '../../baoA/pages/cantuanxq/cantuanxq?goodsid=' + goodsid,
        })
      }
    if (rttype == 7) {
      wx.navigateTo({
        url: '../../baoA/pages/newuserxqq/newuserxqq?goodsid=' + goodsid,
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
  //搜索请求数据
  search(){
    var _this = this;
    if(this.data.shopid){
      //获取搜索结果数据
      wx.request({
        url: app.globalData.url, //自己的服务接口地址
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: 'searchGoodsList2',
          shopId:_this.data.shopid,
          searchKey: _this.data.searchcon,    //搜索关键字
          nowPage: _this.data.page,
        },
        success: function success(res) {
          console.log(res);
          if (_this.data.page == 1) {
            _this.setData({
              goodsList: res.data.goodsList,
              maxpage: res.data.totalPage,
              isend:true
            })
          } else {
            var oldarr = _this.data.goodsList;
            var newarr = res.data.goodsList;
            var endarr = oldarr.concat(newarr);
            _this.setData({
              goodsList: endarr,
              maxpage: res.data.totalPage,
            })
            
          }
          setTimeout(function () {
            wx.hideLoading()
          }, 0)
        }
      });
    }else{
      //获取搜索结果数据
      wx.request({
        url: app.globalData.url, //自己的服务接口地址
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: 'searchGoodsList',
          userId: wx.getStorageSync('userid'),
          cityId: wx.getStorageSync('cityid'),       //城市id
          lng: wx.getStorageSync('longitude'),
          lat: wx.getStorageSync('latitude'),
          searchKey: _this.data.searchcon,    //搜索关键字
          nowPage: _this.data.page,
        },
        success: function success(res) {
          console.log(res);
          if (_this.data.page == 1) {
            _this.setData({
              goodsList: res.data.goodsList,
              maxpage: res.data.totalPage,
              isend:true
            })
          } else {
            var oldarr = _this.data.goodsList;
            var newarr = res.data.goodsList;
            var endarr = oldarr.concat(newarr);
            _this.setData({
              goodsList: endarr,
              maxpage: res.data.totalPage,
            })

          }
          setTimeout(function () {
            wx.hideLoading()
          }, 0)
        },
        fail: function fail() {
          // console.log("系统错误");
        }
      });
    }
    
  },
  //搜索
  tosearch() {
    var _this = this;
    if (this.data.searchcon == '') {
      wx.showToast({
        title: '搜索内容不能为空',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    this.setData({
      page:1,
      isend:false
    })
    wx.showLoading({
      title: '加载中',
    })
    this.search();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var searchcon = options.search;
    wx.showLoading({
      title: '加载中'
    })
    if(options.shopid){
      var shopid = options.shopid;
      //获取搜索结果数据
      
      wx.request({
        url: app.globalData.url, //自己的服务接口地址
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: 'searchGoodsList2',
          shopId:shopid,
          searchKey: options.search,    //搜索关键字
          nowPage: 1,
        },
        success: function success(res) {
          console.log(res);
          
          _this.setData({
            goodsList: res.data.goodsList,
            shopid:shopid,
            maxpage: res.data.totalPage,
            searchcon:searchcon,
            isend:true
          })
          wx.hideLoading()
        }
      });
    }else{
      //获取搜索结果数据
      wx.request({
        url: app.globalData.url, //自己的服务接口地址
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: 'searchGoodsList',
          userId: wx.getStorageSync('userid'),
          cityId: wx.getStorageSync('cityid'),       //城市id
          lng: wx.getStorageSync('longitude'),
          lat: wx.getStorageSync('latitude'),
          searchKey: options.search,    //搜索关键字
          nowPage: 1,
        },
        success: function success(res) {
          console.log(res);
          wx.hideLoading()
          _this.setData({
            goodsList: res.data.goodsList,
            maxpage: res.data.totalPage,
            searchcon: searchcon,
            isend: true
          })
        }
      });
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
    this.setData({
      page: 1
    })
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
      _this.search();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})