// pages/youhuijuan/youhuijuan.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,    //当前页数
    list:[],    //列表
    shopid:'',
    shoptype:0,   //1未传店铺id  2传
    maxpage:'',
    isend:false
  },
  //跳转商品详情
  toxq(e) {
    var _this = this;
    var goodsid = e.currentTarget.dataset.goodsid;
    var type = e.currentTarget.dataset.type;
    var goodstype = e.currentTarget.dataset.goodstype;
    var shopid = e.currentTarget.dataset.shopid;
    var isshop = e.currentTarget.dataset.isshop;
    var juanid = e.currentTarget.dataset.juanid;
    if(type == 1){
      if(isshop == 0){
        wx.navigateTo({
          url: '../dianpu/dianpu?shopid=' + shopid
        })
      }else{
        wx.navigateTo({
          url: '../youhuishop/youhuishop?juanid=' + juanid
        })
      }
      
    }
    if(type == 0){
      if (goodstype == 0){
        wx.navigateTo({
          url: '../shopxq/shopxq?goodsid='+goodsid
        })
      }
      if (goodstype == 1) {
        wx.navigateTo({
          url: '../cantuanxq/cantuanxq?goodsid=' + goodsid
        })
      }
      if (goodstype == 3) {
        wx.navigateTo({
          url: '../manjianxq/manjianxq?goodsid=' + goodsid
        })
      }
      if (goodstype == 4) {
        wx.navigateTo({
          url: '../xianshibuy/xianshibuy?goodsid=' + goodsid
        })
      }
    }
    
  },
  //领劵
  lingjuan(e){
    if (!wx.getStorageSync('userid')) {
      wx.navigateTo({
        url: '../shouquan/shouquan',
      })
      return false;
    }
    var _this = this;
    var juanid = e.currentTarget.dataset.juanid;
    //获取附近分类数据
    wx.request({
      url: app.globalData.url, //自己的服务接口地址
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cmd: 'takeFreeCoupon2',
        userId: wx.getStorageSync('userid'),
        freeCouponId:juanid
      },
      success: function (res) {
        console.log(res);
        if (res.data.result == 0){
          wx.showToast({
            title: res.data.resultNote,
            icon:'none',
            duration:1500
          })
          _this.getlist();
        }else{
          wx.showToast({
            title: res.data.resultNote,
            icon: 'none',
            duration: 1500
          })
        }

      },
    });
  },
  //获取列表
  getlist(){
    var _this = this;
    if(!this.data.shopid){
      wx.request({
        url: app.globalData.url, //自己的服务接口地址
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: 'getNearFreeCouponList',
          lng: wx.getStorageSync('longitude'),
          lat: wx.getStorageSync('latitude'),
          userId: wx.getStorageSync('userid'),
          nowPage: _this.data.page
        },
        success: function (res) {
          console.log(res);
          var list = res.data.shopBeanList;
          for (var i in list) {
            list[i].shopScore = Math.round(list[i].shopScore)
          }
          if (_this.data.page == 1) {
            _this.setData({
              list: list,
              shoptype: 1,
              maxpage: res.data.totalPage,
              isend: true
            })
          } else {
            var oldarr = _this.data.list;
            var newarr = list;
            var endarr = oldarr.concat(newarr);
            _this.setData({
              list: oldarr,
              shoptype: 1,
              maxpage: res.data.totalPage
            })
          }
          
          wx.hideLoading();
        },
      });
    }else{
      wx.request({
        url: app.globalData.url, //自己的服务接口地址
        method: "post",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          cmd: 'getFreeCouponList2',
          userId: wx.getStorageSync('userid'),
          nowPage: _this.data.page,
          shopId:_this.data.shopid
        },
        success: function (res) {
          console.log(res);
          if (_this.data.page == 1) {
            _this.setData({
              list: res.data.freeCouponList,
              shoptype: 2,
              maxpage: res.data.totalPage,
              isend: true
            })
          } else {
            var oldarr = _this.data.list;
            var newarr = res.data.freeCouponList;
            var endarr = oldarr.concat(newarr);
            _this.setData({
              list: oldarr,
              shoptype: 2,
              maxpage: res.data.totalPage
            })
          }

          wx.hideLoading();

        },
      });
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.shopid){
      this.setData({
        shopid:options.shopid
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